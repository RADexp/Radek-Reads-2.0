import { describe, it, expect } from 'vitest';
import { pickGoogleBooksDescription } from './google-books';

describe('pickGoogleBooksDescription', () => {
  it('zwraca opis pierwszego wyniku, który go ma', () => {
    const data = {
      items: [
        { volumeInfo: {} },
        { volumeInfo: { description: '  Testowy opis książki.  ' } },
        { volumeInfo: { description: 'Inny opis, którego nie chcemy.' } },
      ],
    };
    expect(pickGoogleBooksDescription(data)).toBe('Testowy opis książki.');
  });

  it('zwraca null, gdy brak wyników', () => {
    expect(pickGoogleBooksDescription({})).toBeNull();
    expect(pickGoogleBooksDescription({ items: [] })).toBeNull();
  });

  it('zwraca null, gdy żaden wynik nie ma opisu', () => {
    expect(pickGoogleBooksDescription({ items: [{ volumeInfo: {} }, { volumeInfo: { description: '' } }] })).toBeNull();
  });
});
