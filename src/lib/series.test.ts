import { describe, it, expect } from 'vitest';
import { getAllSeries, getSeries, getSeriesPosition, seriesSlug, volumeLabel } from './series';
import type { Book } from './types';

function book(id: string, series?: { name: string; nr?: number }): Book {
  return {
    id,
    shelf: 'finished',
    title: id,
    author: 'A',
    genre: 'Science Fiction',
    lang: 'en',
    format: 'ebook',
    buyLinks: { pl: [], en: [] },
    series: series ? { name: series.name, slug: seriesSlug(series.name), nr: series.nr } : undefined,
  };
}

const books: Book[] = [
  book('heaven', { name: 'Bobiverse', nr: 4 }),
  book('solo'),
  book('legion', { name: 'Bobiverse', nr: 1 }),
  book('worlds', { name: 'Bobiverse', nr: 3 }),
  book('many', { name: 'Bobiverse', nr: 2 }),
  book('acotar', { name: 'Dwór cierni i róż' }),
];

describe('series', () => {
  it('slug cyklu przechodzi przez slugify (polskie znaki)', () => {
    expect(seriesSlug('Dwór cierni i róż')).toBe('dwor-cierni-i-roz');
  });

  it('grupuje książki w cykle i sortuje po numerze tomu', () => {
    const all = getAllSeries(books);
    expect(all.map((s) => s.slug)).toEqual(['bobiverse', 'dwor-cierni-i-roz']);
    expect(all[0].books.map((b) => b.id)).toEqual(['legion', 'many', 'worlds', 'heaven']);
  });

  it('książki bez numeru tomu lądują na końcu, w kolejności z Notion', () => {
    const list = [book('x', { name: 'S' }), book('b', { name: 'S', nr: 2 }), book('y', { name: 'S' })];
    expect(getSeries(list, 's')!.books.map((b) => b.id)).toEqual(['b', 'x', 'y']);
  });

  it('zwraca sąsiednie tomy', () => {
    const pos = getSeriesPosition(books, books.find((b) => b.id === 'many')!)!;
    expect(pos.index).toBe(1);
    expect(pos.prev?.id).toBe('legion');
    expect(pos.next?.id).toBe('worlds');
  });

  it('na krawędziach cyklu brak prev/next', () => {
    const first = getSeriesPosition(books, books.find((b) => b.id === 'legion')!)!;
    const last = getSeriesPosition(books, books.find((b) => b.id === 'heaven')!)!;
    expect(first.prev).toBeUndefined();
    expect(last.next).toBeUndefined();
  });

  it('książka spoza cyklu nie ma pozycji', () => {
    expect(getSeriesPosition(books, books.find((b) => b.id === 'solo')!)).toBeUndefined();
  });

  it('etykieta tomu: numer z Notion albo pozycja', () => {
    expect(volumeLabel(books[0], 0)).toBe(4);
    expect(volumeLabel(books[5], 0)).toBe(1);
  });
});
