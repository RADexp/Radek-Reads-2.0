// Shared constants + badge primitives for the /insta story-screenshot page.
// Reuses RR_Cover / RR_FormatIcon / RR_Flag from lib.jsx and the genre palette
// from data/books.js. Three designs (insta-d1/2/3) consume these.

const I_BG    = '#0B0820';
const I_BG2   = '#15102E';
const I_INK   = '#F4F1FF';
const I_MUTED = '#9E97C8';
const I_ACCENT= '#A78BFA';
const I_LINE  = 'rgba(255,255,255,0.10)';

(function ensureInstaFonts(){
  if (document.getElementById('__rri_fonts')) return;
  const l = document.createElement('link'); l.id='__rri_fonts'; l.rel='stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap';
  document.head.appendChild(l);
})();

const I_SANS = '"Space Grotesk", Inter, system-ui, sans-serif';
const I_MONO = '"JetBrains Mono", ui-monospace, monospace';

window.RR_INSTA = { I_BG, I_BG2, I_INK, I_MUTED, I_ACCENT, I_LINE, I_SANS, I_MONO };

window.RR_instaGenreFg = function(genre){
  const g = window.RR_GENRES[genre];
  return g ? `oklch(0.82 0.16 ${g.hue})` : I_ACCENT;
};
window.RR_instaGenreGlow = function(genre, a=0.45){
  const g = window.RR_GENRES[genre];
  return g ? `oklch(0.55 0.20 ${g.hue} / ${a})` : `rgba(167,139,250,${a})`;
};

window.RR_instaFmt = function(format, lang){
  return ({
    audiobook: lang==='pl' ? 'Audio'  : 'Audio',
    ebook:     'Ebook',
    paper:     lang==='pl' ? 'Papier' : 'Paper',
  })[format] || format;
};

// The reading shelf, capped at `count` (1–4) — the only books /insta ever shows.
window.RR_instaReading = function(count){
  return window.RR_BOOKS.filter(b => b.shelf==='reading').slice(0, Math.max(1, Math.min(4, count)));
};
