// Cykle książek. Źródłem jest Select "Cykl" + Number "Cykl NR" w Notion
// (mapowane w notion.ts na `book.series`). Tu tylko czyste funkcje na liście
// książek, żeby podstrona cyklu i blok na stronie recenzji liczyły to samo.
import { slugify } from './slugify';
import type { Book } from './types';

export interface Series {
  name: string;
  slug: string;
  /** Książki posortowane wg numeru tomu (bez numeru — na końcu). */
  books: Book[];
}

export interface SeriesPosition {
  series: Series;
  /** Pozycja 0-based w posortowanej liście tomów. */
  index: number;
  prev?: Book;
  next?: Book;
}

export function seriesSlug(name: string): string {
  return slugify(name);
}

function byVolume(a: Book, b: Book): number {
  const na = a.series?.nr ?? Number.POSITIVE_INFINITY;
  const nb = b.series?.nr ?? Number.POSITIVE_INFINITY;
  return na - nb; // Array.prototype.sort jest stabilny — remisy zostają w kolejności z Notion
}

/** Wszystkie cykle, w kolejności pierwszego wystąpienia na liście książek. */
export function getAllSeries(books: Book[]): Series[] {
  const map = new Map<string, Series>();
  for (const book of books) {
    if (!book.series) continue;
    const { slug, name } = book.series;
    let entry = map.get(slug);
    if (!entry) {
      entry = { name, slug, books: [] };
      map.set(slug, entry);
    }
    entry.books.push(book);
  }
  for (const s of map.values()) s.books.sort(byVolume);
  return [...map.values()];
}

export function getSeries(books: Book[], slug: string): Series | undefined {
  return getAllSeries(books).find((s) => s.slug === slug);
}

/** Pozycja książki w jej cyklu + sąsiednie tomy (te, które są w bazie). */
export function getSeriesPosition(books: Book[], book: Book): SeriesPosition | undefined {
  if (!book.series) return undefined;
  const series = getSeries(books, book.series.slug);
  if (!series) return undefined;
  const index = series.books.findIndex((b) => b.id === book.id);
  if (index < 0) return undefined;
  return {
    series,
    index,
    prev: series.books[index - 1],
    next: series.books[index + 1],
  };
}

/** Etykieta tomu: numer z Notion, a gdy go brak — pozycja na liście. */
export function volumeLabel(book: Book, index: number): number {
  return book.series?.nr ?? index + 1;
}
