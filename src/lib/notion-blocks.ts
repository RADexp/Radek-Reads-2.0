import type { Client } from '@notionhq/client';
import type {
  BlockObjectResponse,
  PartialBlockObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { sanitizeUrl } from './sanitize-url';
import { extractYoutubeId, isYoutubeOnly } from './youtube';
import type { ReviewBlock } from './types';

export interface ReviewBlocksResult {
  pl: ReviewBlock[];
  en: ReviewBlock[] | null;
}

// Etykieta akapitu zaraz po separatorze, który oddziela angielskie tłumaczenie
// recenzji wklejone ręcznie na tej samej stronie Notion (patrz getReviewBlocks).
const ENGLISH_VERSION_MARKER = /^english version$/i;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function richTextToHtml(rich: RichTextItemResponse[]): string {
  return rich
    .map((rt) => {
      let text = escapeHtml(rt.plain_text);
      const link = rt.href ? sanitizeUrl(rt.href) : null;
      if (rt.annotations.code) text = `<code>${text}</code>`;
      if (rt.annotations.bold) text = `<strong>${text}</strong>`;
      if (rt.annotations.italic) text = `<em>${text}</em>`;
      if (link) {
        text = `<a href="${link}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      }
      return text;
    })
    .join('');
}

function richTextPlain(rich: RichTextItemResponse[]): string {
  return rich.map((rt) => rt.plain_text).join('');
}

async function fetchAllBlocks(
  client: Client,
  blockId: string,
): Promise<BlockObjectResponse[]> {
  const results: BlockObjectResponse[] = [];
  let cursor: string | undefined;
  do {
    const res = await client.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    });
    for (const block of res.results as (BlockObjectResponse | PartialBlockObjectResponse)[]) {
      if ('type' in block) results.push(block);
    }
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);
  return results;
}

export async function getReviewBlocks(
  client: Client,
  pageId: string,
): Promise<ReviewBlocksResult> {
  const blocks = await fetchAllBlocks(client, pageId);
  const pl: ReviewBlock[] = [];
  const en: ReviewBlock[] = [];
  // Angielskie tłumaczenie recenzji (wklejane ręcznie) żyje na tej samej stronie
  // Notion, pod separatorem (`divider`) i akapitem-etykietą "ENGLISH VERSION" —
  // patrz [[book-review-translation]]. Pierwszy divider przełącza dalsze bloki na `en`.
  let out = pl;
  let pendingList: string[] = [];
  let justAfterDivider = false;

  const flushList = () => {
    if (pendingList.length) {
      out.push({ type: 'ul', items: pendingList });
      pendingList = [];
    }
  };

  for (const block of blocks) {
    if (block.type === 'divider') {
      flushList();
      if (out === pl) {
        out = en;
        justAfterDivider = true;
      }
      continue;
    }

    const wasJustAfterDivider = justAfterDivider;
    justAfterDivider = false;

    switch (block.type) {
      case 'heading_1': {
        flushList();
        out.push({ type: 'h1', html: richTextToHtml(block.heading_1.rich_text) });
        break;
      }
      case 'heading_2': {
        flushList();
        out.push({ type: 'h2', html: richTextToHtml(block.heading_2.rich_text) });
        break;
      }
      case 'heading_3': {
        flushList();
        out.push({ type: 'h3', html: richTextToHtml(block.heading_3.rich_text) });
        break;
      }
      case 'bulleted_list_item': {
        pendingList.push(richTextToHtml(block.bulleted_list_item.rich_text));
        break;
      }
      case 'paragraph': {
        flushList();
        const plain = richTextPlain(block.paragraph.rich_text);
        if (wasJustAfterDivider && ENGLISH_VERSION_MARKER.test(plain.trim())) break;
        const ytId = extractYoutubeId(plain);
        if (ytId && isYoutubeOnly(plain)) {
          out.push({ type: 'youtube', youtubeId: ytId });
        } else {
          const html = richTextToHtml(block.paragraph.rich_text);
          if (html.trim()) out.push({ type: 'p', html });
        }
        break;
      }
      case 'video': {
        flushList();
        const url = block.video.type === 'external' ? block.video.external.url : null;
        const ytId = url ? extractYoutubeId(url) : null;
        if (ytId) out.push({ type: 'youtube', youtubeId: ytId });
        break;
      }
      case 'embed': {
        flushList();
        const ytId = extractYoutubeId(block.embed.url);
        if (ytId) out.push({ type: 'youtube', youtubeId: ytId });
        break;
      }
      default:
        // inne typy bloków (image, quote, itd.) pomijane w v1
        flushList();
        break;
    }
  }
  flushList();
  return { pl, en: en.length ? en : null };
}
