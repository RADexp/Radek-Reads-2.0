import { Client } from '@notionhq/client';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { bookSlug } from './slugify';
import { sanitizeUrl } from './sanitize-url';
import { getReviewBlocks } from './notion-blocks';
import type { Book, Format, Lang, Shelf } from './types';

const STATUS_TO_SHELF: Record<string, Shelf> = {
  'Czytam': 'reading',
  'Planuję': 'next',
  'Przeczytane': 'finished',
};

const FORMAT_MAP: Record<string, Format> = {
  'Ebook': 'ebook',
  'Papier': 'paper',
  'Audiobook': 'audiobook',
};

const LANG_MAP: Record<string, Lang> = {
  'Polski': 'pl',
  'Angielski': 'en',
};

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function roundRating(n: number): number {
  return clamp(Math.round(n * 4) / 4, 0, 5);
}

function clampProgress(n: number): number {
  return clamp(Math.round(n), 0, 100);
}

function getText(prop: any): string {
  if (!prop) return '';
  if (prop.type === 'title') return prop.title.map((t: any) => t.plain_text).join('');
  if (prop.type === 'rich_text') return prop.rich_text.map((t: any) => t.plain_text).join('');
  return '';
}

function getSelect(prop: any): string {
  return prop?.select?.name ?? '';
}

function getNumber(prop: any): number | null {
  return typeof prop?.number === 'number' ? prop.number : null;
}

function getUrl(prop: any): string | null {
  return sanitizeUrl(prop?.url ?? null);
}

async function fetchAllPages(client: Client, databaseId: string): Promise<PageObjectResponse[]> {
  const pages: PageObjectResponse[] = [];
  let cursor: string | undefined;
  do {
    const res = await client.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      page_size: 100,
    });
    for (const page of res.results) {
      if ('properties' in page) pages.push(page as PageObjectResponse);
    }
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);
  return pages;
}

let cache: Book[] | null = null;

export async function getBooks(): Promise<Book[]> {
  if (cache) return cache;

  const token = import.meta.env.NOTION_TOKEN;
  const databaseId = import.meta.env.NOTION_DATABASE_ID;
  if (!token || !databaseId) {
    throw new Error(
      'Brak NOTION_TOKEN / NOTION_DATABASE_ID w zmiennych środowiskowych. Sprawdź .env (patrz .env.example).',
    );
  }

  const client = new Client({ auth: token });
  const pages = await fetchAllPages(client, databaseId);

  const seenSlugs = new Map<string, number>();
  const books: Book[] = [];

  for (const page of pages) {
    const props = page.properties;
    const title = getText(props['Tytuł']);
    const author = getText(props['Autor']);
    if (!title) continue; // brak tytułu = nieużyteczny wiersz, pomijamy

    const statusRaw = getSelect(props['Status']);
    const shelf = STATUS_TO_SHELF[statusRaw];
    if (!shelf) {
      console.warn(`[notion] Pomijam "${title}" — nieznany/pusty Status: "${statusRaw}"`);
      continue;
    }

    const formatRaw = getSelect(props['Format']);
    const format = FORMAT_MAP[formatRaw];
    if (!format) {
      console.warn(`[notion] Pomijam "${title}" — nieznany/pusty Format: "${formatRaw}"`);
      continue;
    }

    const langRaw = getSelect(props['Język']);
    const lang = LANG_MAP[langRaw];
    if (!lang) {
      console.warn(`[notion] Pomijam "${title}" — nieznany/pusty Język: "${langRaw}"`);
      continue;
    }

    const genre = getSelect(props['Gatunek']) || 'Inne';

    let slug = bookSlug(title, author);
    const count = seenSlugs.get(slug) ?? 0;
    if (count > 0) {
      console.warn(`[notion] Kolizja sluga "${slug}" dla "${title}" — dodaję sufiks.`);
      slug = `${slug}-${count + 1}`;
    }
    seenSlugs.set(bookSlug(title, author), count + 1);

    const ratingRaw = getNumber(props['Ocena']);
    const rating = ratingRaw && ratingRaw > 0 ? roundRating(ratingRaw) : undefined;

    const progressRaw = getNumber(props['Progress']);
    const progress =
      shelf === 'reading' && progressRaw != null ? clampProgress(progressRaw) : undefined;

    const cover = getUrl(props['URL okładki']) ?? undefined;

    const linkPl = getUrl(props['Link Polish']);
    const linkEn = getUrl(props['Link English']);

    let review = undefined;
    if (shelf === 'finished') {
      const blocks = await getReviewBlocks(client, page.id);
      if (blocks.length) review = blocks;
    }

    books.push({
      id: slug,
      shelf,
      title,
      author,
      genre,
      lang,
      format,
      cover,
      progress,
      rating,
      review,
      buyLinks: {
        pl: linkPl ? [{ retailer: 'Kup po polsku', url: linkPl, kind: format }] : [],
        en: linkEn ? [{ retailer: 'Buy in English', url: linkEn, kind: format }] : [],
      },
    });
  }

  cache = books;
  return books;
}
