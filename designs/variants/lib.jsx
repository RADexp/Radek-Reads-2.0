// Shared helpers used by all three variants.

window.RR_StarRow = function StarRow({ value=0, size=12, color='currentColor', muted='rgba(0,0,0,.15)' }) {
  return (
    <span className="rr-stars" style={{display:'inline-flex', gap:1, lineHeight:1}}>
      {[1,2,3,4,5].map(n => (
        <svg key={n} width={size} height={size} viewBox="0 0 20 20" style={{display:'block'}}>
          <path d="M10 1.6l2.6 5.3 5.9.86-4.25 4.14 1 5.86L10 14.98l-5.25 2.78 1-5.86L1.5 7.76l5.9-.86z"
            fill={n<=value? color : muted} />
        </svg>
      ))}
    </span>
  );
};

window.RR_FormatIcon = function FormatIcon({ format, size=12, color='currentColor' }) {
  const s = { width:size, height:size, display:'inline-block', verticalAlign:'-2px', color };
  if (format === 'audiobook') return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"/>
    </svg>
  );
  if (format === 'ebook') return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="3" width="14" height="18" rx="1.5"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/>
    </svg>
  );
  return ( // paper
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h11a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z"/><path d="M4 16a4 4 0 0 1 4-4h11"/>
    </svg>
  );
};

window.RR_Flag = function Flag({ lang, size=12 }) {
  if (lang === 'pl') return (
    <span className="rr-flag" style={{display:'inline-block', width:size*1.5, height:size, borderRadius:1.5, overflow:'hidden', verticalAlign:'-1px', boxShadow:'inset 0 0 0 1px rgba(0,0,0,.08)'}}>
      <span style={{display:'block', height:'50%', background:'#fff'}}/>
      <span style={{display:'block', height:'50%', background:'#dc143c'}}/>
    </span>
  );
  // EN (UK union jack simplified)
  return (
    <span className="rr-flag" style={{display:'inline-block', width:size*1.5, height:size, borderRadius:1.5, background:'#012169', position:'relative', verticalAlign:'-1px', overflow:'hidden', boxShadow:'inset 0 0 0 1px rgba(0,0,0,.08)'}}>
      <span style={{position:'absolute', inset:0, background:'linear-gradient(to bottom right, transparent 45%, #fff 45%, #fff 55%, transparent 55%), linear-gradient(to bottom left, transparent 45%, #fff 45%, #fff 55%, transparent 55%)'}}/>
      <span style={{position:'absolute', left:'50%', top:0, bottom:0, width:'18%', transform:'translateX(-50%)', background:'#fff'}}/>
      <span style={{position:'absolute', top:'50%', left:0, right:0, height:'30%', transform:'translateY(-50%)', background:'#fff'}}/>
      <span style={{position:'absolute', left:'50%', top:0, bottom:0, width:'10%', transform:'translateX(-50%)', background:'#c8102e'}}/>
      <span style={{position:'absolute', top:'50%', left:0, right:0, height:'18%', transform:'translateY(-50%)', background:'#c8102e'}}/>
    </span>
  );
};

// Book cover placeholder. Renders the spine color + title typography so each
// "cover" reads as a real book without us shipping image assets.
window.RR_Cover = function Cover({ book, w=110, h=160, radius=6, shadow=true }) {
  const titleSize = Math.max(10, Math.round(w/8));
  const authorSize = Math.max(8, Math.round(w/14));
  return (
    <div style={{
      width:w, height:h, borderRadius:radius, background:book.color || '#3a3a55',
      color:'#fff', padding:Math.round(w*0.08), boxSizing:'border-box',
      display:'flex', flexDirection:'column', justifyContent:'space-between',
      boxShadow: shadow ? '0 4px 14px -4px rgba(20,10,60,.35), inset 0 0 0 1px rgba(255,255,255,.06)' : 'none',
      position:'relative', overflow:'hidden', flexShrink:0,
    }}>
      <div style={{
        fontFamily:'Georgia, "Times New Roman", serif',
        fontWeight:700, fontSize:titleSize, lineHeight:1.05, letterSpacing:'-0.01em',
        textShadow:'0 1px 2px rgba(0,0,0,.25)', wordBreak:'break-word',
      }}>{book.title}</div>
      <div style={{
        fontSize:authorSize, opacity:.85, fontFamily:'Inter, system-ui, sans-serif',
        textTransform:'uppercase', letterSpacing:'.06em', fontWeight:600,
      }}>{book.author}</div>
      {/* Light glare to fake cover gloss */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        background:'linear-gradient(120deg, rgba(255,255,255,.12) 0%, transparent 35%, transparent 100%)',
      }}/>
    </div>
  );
};

window.RR_useFilters = function useFilters(books) {
  const [q, setQ] = React.useState('');
  const [genre, setGenre] = React.useState('all');
  const [lang, setLang] = React.useState('all');
  const [format, setFormat] = React.useState('all');
  const [minRating, setMinRating] = React.useState(0);

  const filtered = React.useMemo(() => books.filter(b => {
    if (genre !== 'all' && b.genre !== genre) return false;
    if (lang !== 'all' && b.lang !== lang) return false;
    if (format !== 'all' && b.format !== format) return false;
    if (minRating > 0 && (b.rating||0) < minRating) return false;
    if (q && !(b.title + ' ' + b.author).toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [books, q, genre, lang, format, minRating]);

  return { q, setQ, genre, setGenre, lang, setLang, format, setFormat, minRating, setMinRating, filtered };
};
