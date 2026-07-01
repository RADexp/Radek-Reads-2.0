// Mapowanie gatunków -> hue (kolor chipa). Bazowa lista to realne wartości selecta
// "Gatunek" w Notion. Traktujemy ją jako rozszerzalną: nieznana wartość (nowy
// gatunek dodany w Notion) dostaje deterministyczny hue z hasha nazwy, więc nic
// się nie wywali, gdy ktoś rozszerzy listę bez aktualizacji kodu.
export const GENRE_HUES: Record<string, { pl: string; en: string; hue: number }> = {
  'Science Fiction': { pl: 'Science Fiction', en: 'Science Fiction', hue: 265 },
  'Psychologiczna': { pl: 'Psychologiczna', en: 'Psychology', hue: 200 },
  'Biznesowa': { pl: 'Biznesowa', en: 'Business', hue: 30 },
  'Non-fiction': { pl: 'Non-fiction', en: 'Non-fiction', hue: 170 },
  'Popularnonaukowa': { pl: 'Popularnonaukowa', en: 'Popular science', hue: 190 },
  'Self development': { pl: 'Self development', en: 'Self development', hue: 145 },
  'Sportowa': { pl: 'Sportowa', en: 'Sports', hue: 95 },
  'Romantasy': { pl: 'Romantasy', en: 'Romantasy', hue: 340 },
};

function hashHue(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0;
  }
  return h % 360;
}

export function genreInfo(genre: string): { pl: string; en: string; hue: number } {
  return GENRE_HUES[genre] ?? { pl: genre, en: genre, hue: hashHue(genre) };
}

export function genreLabel(genre: string, lang: 'pl' | 'en'): string {
  const info = genreInfo(genre);
  return lang === 'pl' ? info.pl : info.en;
}
