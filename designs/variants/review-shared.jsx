// Shared primitives for the three book-review page designs.
// Dark, genre-coded palette consistent with Variant C of the redesign.

const RV = {
  BG:    '#0B0820',
  BG2:   '#15102E',
  INK:   '#F4F1FF',
  MUTED: '#9E97C8',
  FAINT: '#6E68A0',
  ACCENT:'#A78BFA',
  LINE:  'rgba(255,255,255,0.08)',
  LINE2: 'rgba(255,255,255,0.14)',
  SANS:  '"Space Grotesk", Inter, system-ui, sans-serif',
  MONO:  '"JetBrains Mono", ui-monospace, monospace',
  SERIF: '"Newsreader", Georgia, "Times New Roman", serif',
};
window.RV = RV;

(function ensureRVFonts(){
  if (document.getElementById('__rv_fonts')) return;
  const l = document.createElement('link'); l.id='__rv_fonts'; l.rel='stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&display=swap';
  document.head.appendChild(l);
})();

// ── genre color helpers ─────────────────────────────────────────────
window.RV_genreBg = function (genre, alpha=0.18) {
  const g = window.RR_GENRES[genre];
  if (!g) return 'transparent';
  return `oklch(0.42 0.18 ${g.hue} / ${alpha})`;
};
window.RV_genreFg = function (genre) {
  const g = window.RR_GENRES[genre];
  if (!g) return RV.INK;
  return `oklch(0.82 0.16 ${g.hue})`;
};
window.RV_genreHue = function (genre) {
  const g = window.RR_GENRES[genre];
  return g ? g.hue : 280;
};

// ── small UI primitives ─────────────────────────────────────────────
window.RV_GenreTag = function GenreTag({ genre, lang='pl', size=10 }) {
  const g = window.RR_GENRES[genre];
  if (!g) return null;
  return (
    <span style={{
      fontFamily:RV.MONO, fontSize:size, fontWeight:500, letterSpacing:'.06em',
      textTransform:'uppercase', padding:'3px 8px', borderRadius:4, whiteSpace:'nowrap',
      display:'inline-block',
      background:`oklch(0.32 0.14 ${g.hue} / 0.55)`,
      color:`oklch(0.88 0.14 ${g.hue})`,
      border:`1px solid oklch(0.55 0.18 ${g.hue} / 0.4)`,
    }}>{g[lang] || g.pl}</span>
  );
};

window.RV_MetaInline = function MetaInline({ book, lang='pl', color=RV.MUTED, size=11 }) {
  const fmt = { audiobook:'AUDIO', ebook:'EBOOK', paper: lang==='pl'?'PAPIER':'PAPER' }[book.format];
  return (
    <span style={{fontFamily:RV.MONO, fontSize:size, color, letterSpacing:'.08em',
      display:'inline-flex', flexWrap:'wrap', alignItems:'center', gap:7, whiteSpace:'nowrap'}}>
      <span style={{display:'inline-flex', alignItems:'center', gap:7}}>
        <window.RR_FormatIcon format={book.format} size={size} color={color}/>
        {fmt}
      </span>
      <span style={{opacity:.45}}>·</span>
      <span style={{display:'inline-flex', alignItems:'center', gap:7}}>
        <window.RR_Flag lang={book.lang} size={size-2}/>
        {book.lang==='pl' ? 'PL' : 'EN'}
      </span>
    </span>
  );
};

window.RV_Stars = function Stars({ value, size=16, genre }) {
  const c = genre ? window.RV_genreFg(genre) : RV.ACCENT;
  return <window.RR_StarRow value={value} size={size} color={c} muted="rgba(255,255,255,.15)"/>;
};

// big rating block: stars + "ocena X/5"
window.RV_Rating = function Rating({ value, genre, lang='pl', size=18 }) {
  return (
    <span style={{display:'inline-flex', alignItems:'center', gap:10}}>
      <window.RV_Stars value={value} size={size} genre={genre}/>
      <span style={{fontFamily:RV.MONO, fontSize:size-5, color:RV.MUTED, letterSpacing:'.06em'}}>
        {lang==='pl'?'ocena':'rated'} {value}/5
      </span>
    </span>
  );
};

window.RV_Progress = function Progress({ value=0, genre, lang='pl', height=6 }) {
  const c = genre ? window.RV_genreFg(genre) : RV.ACCENT;
  return (
    <div style={{width:'100%'}}>
      <div style={{display:'flex', justifyContent:'space-between', fontFamily:RV.MONO,
        fontSize:10, color:RV.MUTED, letterSpacing:'.08em', marginBottom:6}}>
        <span>{lang==='pl'?'TERAZ CZYTAM':'READING NOW'}</span>
        <span style={{color:c, fontWeight:700}}>{value}%</span>
      </div>
      <div style={{height, background:'rgba(255,255,255,.08)', borderRadius:99, overflow:'hidden'}}>
        <div style={{height:'100%', width:`${value}%`, background:c, borderRadius:99}}/>
      </div>
    </div>
  );
};

// Page header: wordmark (home anchor, left) + "← all books" breadcrumb.
// `context` shows an optional muted label on the right (hidden on mobile).
window.RV_PageHeader = function PageHeader({ lang='pl', context=null }) {
  return (
    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap'}}>
      <div style={{display:'flex', alignItems:'center', gap:13}}>
        <a href="#" style={{display:'inline-flex', alignItems:'center', gap:10, textDecoration:'none'}}>
          <span style={{width:28, height:28, borderRadius:8, padding:2, display:'grid', placeItems:'center', flexShrink:0,
            background:'conic-gradient(from 180deg, #A78BFA, #EC4899, #F59E0B, #10B981, #A78BFA)'}}>
            <span style={{width:'100%', height:'100%', borderRadius:6, background:RV.BG, display:'grid', placeItems:'center',
              fontFamily:RV.SANS, fontWeight:700, fontSize:14, color:RV.INK}}>R</span>
          </span>
          <span style={{fontFamily:RV.SANS, fontWeight:700, fontSize:16, letterSpacing:'-.02em', color:RV.INK}}>radek.czyta</span>
        </a>
        <span style={{width:1, height:20, background:RV.LINE2}}/>
        <a href="#" style={{display:'inline-flex', alignItems:'center', gap:7, textDecoration:'none',
          fontFamily:RV.MONO, fontSize:11, letterSpacing:'.08em', textTransform:'uppercase', color:RV.MUTED}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          {lang==='pl' ? 'Wszystkie książki' : 'All books'}
        </a>
      </div>
      {context && (
        <span style={{fontFamily:RV.MONO, fontSize:10, color:RV.FAINT, letterSpacing:'.14em', textTransform:'uppercase'}}>
          {context}
        </span>
      )}
    </div>
  );
};

window.RV_BackLink = function BackLink({ lang='pl', color=RV.MUTED }) {
  return (
    <a href="#" style={{display:'inline-flex', alignItems:'center', gap:8, textDecoration:'none',
      fontFamily:RV.MONO, fontSize:11, letterSpacing:'.1em', textTransform:'uppercase',
      color, paddingBlock:4}}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
      </svg>
      {lang==='pl' ? 'Półka' : 'Shelf'}
    </a>
  );
};

// ── retailer link button (used inside each design's "where to buy" block) ──
function retailerIcon(kind, size, color){
  if (kind==='paper' || kind==='ebook' || kind==='audiobook')
    return <window.RR_FormatIcon format={kind} size={size} color={color}/>;
  // generic external-link icon for "info" (catalogue) links
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  );
}

window.RV_RetailerBtn = function RetailerBtn({ retailer, kind, hue=280, block=false, solid=false }) {
  const fg = solid ? '#0B0820' : `oklch(0.9 0.05 ${hue})`;
  const bg = solid ? `oklch(0.78 0.15 ${hue})` : `oklch(0.42 0.16 ${hue} / 0.16)`;
  const bd = solid ? 'transparent' : `oklch(0.6 0.16 ${hue} / 0.4)`;
  return (
    <a href="#" style={{
      display:'inline-flex', alignItems:'center', justifyContent:block?'space-between':'flex-start',
      gap:9, width:block?'100%':'auto', boxSizing:'border-box',
      padding:'10px 14px', borderRadius:10, textDecoration:'none',
      background:bg, border:`1px solid ${bd}`, color:fg,
      fontFamily:RV.SANS, fontSize:14, fontWeight:600, letterSpacing:'-.01em',
    }}>
      <span style={{display:'inline-flex', alignItems:'center', gap:9}}>
        {retailerIcon(kind, 15, fg)}
        {retailer}
      </span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" style={{opacity:.7}}>
        <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
      </svg>
    </a>
  );
};

// "where to buy" — PL column + EN column. `which` (both|pl|en) lets the
// page show one or both languages; an empty/omitted column simply disappears.
window.RV_BuyLinks = function BuyLinks({ bookId, lang='pl', which='both', hue=280, layout='row', heading=true }) {
  const data = window.RR_LINKS[bookId] || {};
  const cols = [];
  const showPl = (which==='both'||which==='pl') && data.pl && data.pl.length;
  const showEn = (which==='both'||which==='en') && data.en && data.en.length;
  if (showPl) cols.push({ key:'pl', label: lang==='pl'?'Po polsku':'In Polish', flag:'pl', items:data.pl });
  if (showEn) cols.push({ key:'en', label: lang==='pl'?'Po angielsku':'In English', flag:'en', items:data.en });
  if (!cols.length) return null;

  return (
    <div>
      {heading && (
        <div style={{fontFamily:RV.MONO, fontSize:10, color:RV.MUTED, letterSpacing:'.16em',
          textTransform:'uppercase', marginBottom:12}}>
          {lang==='pl'?'Gdzie zdobyć':'Where to get it'}
        </div>
      )}
      <div style={{display:'grid',
        gridTemplateColumns: layout==='row' ? `repeat(${cols.length}, minmax(0,1fr))` : '1fr',
        gap:16}}>
        {cols.map(col => (
          <div key={col.key}>
            <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:9}}>
              <window.RR_Flag lang={col.flag} size={12}/>
              <span style={{fontFamily:RV.MONO, fontSize:11, color:RV.MUTED, letterSpacing:'.08em', textTransform:'uppercase'}}>
                {col.label}
              </span>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:8}}>
              {col.items.map((it,i) => (
                <window.RV_RetailerBtn key={i} retailer={it.retailer} kind={it.kind} hue={hue}
                  block solid={col.key===cols[0].key && i===0}/>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// note shown when a book is rated but has no written review yet, or is still
// being read.
window.RV_StateNote = function StateNote({ state, lang='pl', hue=280 }) {
  const txt = state==='reading'
    ? (lang==='pl' ? 'Jeszcze w trakcie czytania — recenzja pojawi się po skończeniu książki.'
                   : 'Still reading — the review will appear once I finish the book.')
    : (lang==='pl' ? 'Ocena już jest, ale pełną recenzję dopiero piszę. Zajrzyj wkrótce.'
                   : 'Rated already, but the full review is still being written. Check back soon.');
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:12, padding:'16px 18px', borderRadius:12,
      background:`oklch(0.42 0.16 ${hue} / 0.10)`, border:`1px dashed oklch(0.6 0.16 ${hue} / 0.4)`,
      fontFamily:RV.SANS, fontSize:14.5, color:RV.MUTED, lineHeight:1.5,
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={window.RV_genreFg && `oklch(0.82 0.16 ${hue})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
        <circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/>
      </svg>
      {txt}
    </div>
  );
};
