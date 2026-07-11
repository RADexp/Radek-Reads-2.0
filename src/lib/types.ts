export type Shelf = 'reading' | 'next' | 'finished';
export type Format = 'paper' | 'ebook' | 'audiobook';
export type Lang = 'pl' | 'en';

export interface BuyLink {
  retailer: string;
  url: string;
  kind: Format | 'info';
}

export interface ReviewBlock {
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'ul' | 'youtube';
  html?: string;
  items?: string[];
  youtubeId?: string;
}

export interface Book {
  id: string;
  shelf: Shelf;
  title: string;
  author: string;
  genre: string;
  lang: Lang;
  format: Format;
  cover?: string;
  progress?: number;
  rating?: number;
  dateRead?: string;
  review?: ReviewBlock[];
  buyLinks: { pl: BuyLink[]; en: BuyLink[] };
}
