export const dict = {
  siteName: { pl: 'radek.czyta', en: 'radek.reads' },
  tagline: {
    pl: 'Książki, które teraz pożeram.',
    en: 'Books I am devouring right now.',
  },
  shelfReading: { pl: 'Teraz czytam', en: 'Reading now' },
  shelfNext: { pl: 'Następne', en: 'Up next' },
  shelfFinished: { pl: 'Przeczytane', en: 'Finished' },
  about: { pl: 'O mnie', en: 'About' },
  allBooks: { pl: 'Wszystkie książki', en: 'All books' },
  backToShelf: { pl: 'Półka', en: 'Shelf' },
  genre: { pl: 'Gatunek', en: 'Genre' },
  language: { pl: 'Język', en: 'Language' },
  format: { pl: 'Format', en: 'Format' },
  rating: { pl: 'Ocena', en: 'Rating' },
  all: { pl: 'Wszystkie', en: 'All' },
  filters: { pl: 'Filtry', en: 'Filters' },
  audiobook: { pl: 'Audio', en: 'Audio' },
  ebook: { pl: 'Ebook', en: 'Ebook' },
  paper: { pl: 'Papier', en: 'Paper' },
  progress: { pl: 'Postęp', en: 'Progress' },
  readingNow: { pl: 'Teraz czytam', en: 'Reading now' },
  rated: { pl: 'ocena', en: 'rated' },
  whereToGet: { pl: 'Gdzie zdobyć', en: 'Where to get it' },
  inPolish: { pl: 'Po polsku', en: 'In Polish' },
  inEnglish: { pl: 'Po angielsku', en: 'In English' },
  about_book: { pl: 'O czym jest książka', en: 'What the book is about' },
  noReviewYetReading: {
    pl: 'Jeszcze w trakcie czytania — recenzja pojawi się po skończeniu książki.',
    en: 'Still reading — the review will appear once I finish the book.',
  },
  noReviewYetRated: {
    pl: 'Ocena już jest, ale pełną recenzję dopiero piszę. Zajrzyj wkrótce.',
    en: 'Rated already, but the full review is still being written. Check back soon.',
  },
  emptySection: { pl: 'Brak danych', en: 'No data yet' },
  searchPlaceholder: { pl: 'Szukaj tytułu lub autora…', en: 'Search title or author…' },
} as const;

export type DictKey = keyof typeof dict;

export function t(key: DictKey, lang: 'pl' | 'en'): string {
  return dict[key][lang];
}
