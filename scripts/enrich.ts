// Uzupełnia właściwość "Opis wydawnictwa" w Notion dla książek, które jej
// jeszcze nie mają: PL ze scrapingu lubimyczytac.pl (Link Polish), z fallbackiem
// do Google Books API. Uruchom przez `npm run enrich` (dodaj `-- --dry-run`,
// żeby tylko zobaczyć co by się zapisało, bez faktycznego zapisu do Notion).

import { existsSync, readFileSync } from 'node:fs';
import { Client } from '@notionhq/client';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { getText, getUrl } from '../src/lib/notion';
import { parseLubimyczytacDescription } from '../src/lib/lubimyczytac';
import { fetchGoogleBooksDescription } from '../src/lib/google-books';

function loadEnvFile(path: string): void {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    if (process.env[key] === undefined) process.env[key] = trimmed.slice(eq + 1).trim();
  }
}

loadEnvFile('.env');

const DESCRIPTION_PROPERTY = 'Opis wydawnictwa';
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const THROTTLE_MS = 1500;
// Notion obcina pojedynczy fragment rich_text do 2000 znaków, ale właściwość
// może mieć wiele fragmentów — dłuższe opisy dzielimy, żeby nic nie ucinać.
const NOTION_RICH_TEXT_CHUNK_LENGTH = 2000;

function toRichTextChunks(text: string): { text: { content: string } }[] {
  const chunks: { text: { content: string } }[] = [];
  for (let i = 0; i < text.length; i += NOTION_RICH_TEXT_CHUNK_LENGTH) {
    chunks.push({ text: { content: text.slice(i, i + NOTION_RICH_TEXT_CHUNK_LENGTH) } });
  }
  return chunks;
}

const dryRun = process.argv.includes('--dry-run');

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchLubimyczytacDescription(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) return null;
    return parseLubimyczytacDescription(await res.text());
  } catch {
    return null;
  }
}

async function findPagesMissingDescription(
  client: Client,
  databaseId: string,
): Promise<PageObjectResponse[]> {
  const pages: PageObjectResponse[] = [];
  let cursor: string | undefined;
  do {
    const res = await client.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      page_size: 100,
      filter: {
        and: [
          { property: DESCRIPTION_PROPERTY, rich_text: { is_empty: true } },
          // Opis pokazujemy tylko na stronach bez pełnej recenzji — dla przeczytanych
          // książek z recenzją i tak by się nie wyświetlił, więc nie ma sensu go pobierać.
          {
            or: [
              { property: 'Status', select: { equals: 'Czytam' } },
              { property: 'Status', select: { equals: 'Planuję' } },
            ],
          },
        ],
      },
    });
    for (const page of res.results) {
      if ('properties' in page) pages.push(page as PageObjectResponse);
    }
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);
  return pages;
}

async function main(): Promise<void> {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!token || !databaseId) {
    throw new Error('Brak NOTION_TOKEN / NOTION_DATABASE_ID w zmiennych środowiskowych (sprawdź .env).');
  }

  const client = new Client({ auth: token });
  const pages = await findPagesMissingDescription(client, databaseId);
  console.log(
    `[enrich] Znaleziono ${pages.length} książek bez "${DESCRIPTION_PROPERTY}".${dryRun ? ' (dry-run — nic nie zapiszę)' : ''}`,
  );

  for (const page of pages) {
    const props = page.properties;
    const title = getText(props['Tytuł']);
    const author = getText(props['Autor']);
    const linkPl = getUrl(props['Link Polish']);

    try {
      let description: string | null = null;
      let source = '';

      if (linkPl?.includes('lubimyczytac.pl')) {
        description = await fetchLubimyczytacDescription(linkPl);
        if (description) source = 'lubimyczytac.pl';
      }

      if (!description && title) {
        description = await fetchGoogleBooksDescription(title, author);
        if (description) source = 'Google Books';
      }

      if (!description) {
        console.log(`[enrich] brak opisu — "${title}" (${author || 'brak autora'})`);
      } else {
        console.log(`[enrich] OK ← ${source} — "${title}" (${description.length} znaków)`);
        if (!dryRun) {
          await client.pages.update({
            page_id: page.id,
            properties: {
              [DESCRIPTION_PROPERTY]: {
                rich_text: toRichTextChunks(description),
              },
            },
          });
        }
      }
    } catch (err) {
      console.error(`[enrich] BŁĄD — "${title}":`, err instanceof Error ? err.message : err);
    }

    await sleep(THROTTLE_MS);
  }

  console.log('[enrich] Gotowe.');
}

main().catch((err) => {
  console.error('[enrich] Nieoczekiwany błąd:', err);
  process.exitCode = 1;
});
