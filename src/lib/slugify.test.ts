import { describe, it, expect } from 'vitest';
import { slugify, bookSlug } from './slugify';

describe('slugify', () => {
  it('zamienia polskie znaki z dekompozycją NFD na ASCII', () => {
    expect(slugify('Zażółć gęślą jaźń')).toBe('zazolc-gesla-jazn');
  });

  it('mapuje ł/Ł na l (brak dekompozycji NFD — regresja z fix 432a875)', () => {
    expect(slugify('Łukasz Wróbel')).toBe('lukasz-wrobel');
    expect(slugify('źdźbło')).toBe('zdzblo');
  });

  it('redukuje ciągi znaków niealfanumerycznych do pojedynczego myślnika', () => {
    expect(slugify('The Five: 5 lat!!!')).toBe('the-five-5-lat');
  });

  it('obcina myślniki z krawędzi', () => {
    expect(slugify('  --Hello--  ')).toBe('hello');
  });

  it('zwraca pusty string dla wejścia bez znaków alfanumerycznych', () => {
    expect(slugify('—–…')).toBe('');
  });
});

describe('bookSlug', () => {
  it('łączy tytuł i autora w jeden slug', () => {
    expect(bookSlug('Dzienniki Gwiazdowe', 'Stanisław Lem')).toBe(
      'dzienniki-gwiazdowe-stanislaw-lem',
    );
  });
});
