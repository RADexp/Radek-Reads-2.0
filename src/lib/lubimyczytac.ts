// Wyciąga opis wydawnictwa z HTML strony lubimyczytac.pl. JSON-LD tej strony
// nie zawiera opisu (tylko metadane + recenzje userów), więc parsujemy fragment
// #book-description. Jego treść to zawsze czysty tekst + <br>/<p> (bez zagnieżdżonych
// <div>), więc pierwszy napotkany </div> jest niezawodną granicą końca bloku —
// w przeciwieństwie do przycisku "więcej", który nie występuje przy krótkich opisach.
const DESCRIPTION_START = /<div[^>]*id="book-description"[^>]*>/;
const DESCRIPTION_END = /<\/div>/i;
// Lubimyczytac wpisuje tę frazę zamiast realnego opisu, gdy żaden nie został dodany.
const NO_DESCRIPTION_PLACEHOLDER = /nie posiada jeszcze opisu/i;

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

export function parseLubimyczytacDescription(html: string): string | null {
  const startMatch = DESCRIPTION_START.exec(html);
  if (!startMatch) return null;

  const afterStart = html.slice(startMatch.index + startMatch[0].length);
  const endMatch = DESCRIPTION_END.exec(afterStart);
  const raw = endMatch ? afterStart.slice(0, endMatch.index) : afterStart;

  const text = decodeEntities(
    raw
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<[^>]+>/g, ''),
  )
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (!text || NO_DESCRIPTION_PLACEHOLDER.test(text)) return null;
  return text;
}
