import { describe, it, expect } from 'vitest';
import { parseLubimyczytacDescription } from './lubimyczytac';

function fixturePage(descriptionHtml: string): string {
  return `<!doctype html><html><body>
    <div class="col-lg-12 pl-lg-3 px-0">
      <div id="book-description" class="book__description text-collapse pr-0 pl-0 pl-lg-3">${descriptionHtml}</div>
      <div class="col-lg-12 pl-lg-3 px-0">
        <button type="button" aria-label="więcej" class="js-book-read-more btn btn-link" data-text-collapse-toggle="book-description">
          <i class="icon icon-arrow-down"></i>
        </button>
      </div>
    </div>
  </body></html>`;
}

describe('parseLubimyczytacDescription', () => {
  it('wyciąga tekst opisu, zamieniając <br> na nowe linie', () => {
    const html = fixturePage(
      'Pierwsze zdanie opisu.<br /><br />Drugie zdanie, już w nowym akapicie.',
    );
    expect(parseLubimyczytacDescription(html)).toBe(
      'Pierwsze zdanie opisu.\n\nDrugie zdanie, już w nowym akapicie.',
    );
  });

  it('dekoduje encje HTML i usuwa pozostałe tagi', () => {
    const html = fixturePage('To jest &quot;testowy&quot; opis &amp; ma <b>pogrubienie</b>.');
    expect(parseLubimyczytacDescription(html)).toBe('To jest "testowy" opis & ma pogrubienie.');
  });

  it('zwraca null, gdy strona nie ma bloku #book-description', () => {
    expect(parseLubimyczytacDescription('<html><body>brak opisu</body></html>')).toBeNull();
  });

  it('zwraca null dla pustego opisu', () => {
    expect(parseLubimyczytacDescription(fixturePage('   '))).toBeNull();
  });

  it('zwraca null i nie połyka reszty strony, gdy brak przycisku "więcej" (krótki opis)', () => {
    const html = `<!doctype html><html><body>
      <div id="book-description" class="book__description"><p> Ta książka nie posiada jeszcze opisu.</p></div>
      <div class="unrelated-section">Zupełnie inna treść strony, która nie powinna trafić do wyniku.</div>
    </body></html>`;
    expect(parseLubimyczytacDescription(html)).toBeNull();
  });

  it('poprawnie kończy na pierwszym </div>, nawet bez przycisku "więcej"', () => {
    const html = `<!doctype html><html><body>
      <div id="book-description" class="book__description">Krótki, prawdziwy opis książki.</div>
      <div class="unrelated-section">Ta treść nie powinna trafić do wyniku.</div>
    </body></html>`;
    expect(parseLubimyczytacDescription(html)).toBe('Krótki, prawdziwy opis książki.');
  });
});
