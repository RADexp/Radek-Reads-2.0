// Variant C — "Bold genre-coded / Dark"
// Dark canvas, each book card carries a genre-tinted backdrop so genre is
// readable at-a-glance. Bento now-reading layout. Mono labels.

const C_BG    = '#0B0820';
const C_BG2   = '#15102E';
const C_INK   = '#F4F1FF';
const C_MUTED = '#9E97C8';
const C_ACCENT= '#A78BFA';
const C_LINE  = 'rgba(255,255,255,0.08)';

(function ensureCFonts(){
  if (document.getElementById('__rrc_fonts')) return;
  const l = document.createElement('link'); l.id='__rrc_fonts'; l.rel='stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap';
  document.head.appendChild(l);
})();

const C_SANS = '"Space Grotesk", Inter, system-ui, sans-serif';
const C_MONO = '"JetBrains Mono", ui-monospace, monospace';

function genreBg(genre, alpha=0.18) {
  const g = window.RR_GENRES[genre];
  if (!g) return 'transparent';
  return `oklch(0.42 0.18 ${g.hue} / ${alpha})`;
}
function genreFg(genre) {
  const g = window.RR_GENRES[genre];
  if (!g) return C_INK;
  return `oklch(0.82 0.16 ${g.hue})`;
}

function CGenreTag({ genre, lang='pl' }) {
  const g = window.RR_GENRES[genre];
  if (!g) return null;
  return (
    <span style={{
      fontFamily:C_MONO, fontSize:10, fontWeight:500, letterSpacing:'.06em',
      textTransform:'uppercase', padding:'3px 7px', borderRadius:4, whiteSpace:'nowrap',
      background:`oklch(0.32 0.14 ${g.hue} / 0.55)`,
      color:`oklch(0.88 0.14 ${g.hue})`,
      border:`1px solid oklch(0.55 0.18 ${g.hue} / 0.4)`,
    }}>{g[lang] || g.pl}</span>
  );
}

function CMeta({ book, lang='pl' }) {
  const fmt = { audiobook: lang==='pl'?'AUDIO':'AUDIO', ebook:'EBOOK', paper: lang==='pl'?'PAPIER':'PAPER' }[book.format];
  return (
    <div style={{fontFamily:C_MONO, fontSize:10, color:C_MUTED, letterSpacing:'.08em',
      display:'flex', flexWrap:'wrap', justifyContent:'inherit', alignItems:'center', gap:6, maxWidth:'100%'}}>
      <window.RR_FormatIcon format={book.format} size={11} color={C_MUTED}/>
      {fmt}
      <span style={{opacity:.5}}>·</span>
      <window.RR_Flag lang={book.lang} size={9}/>
      {book.lang==='pl' ? 'PL' : 'EN'}
    </div>
  );
}

function CStars({ value }) {
  return <window.RR_StarRow value={value} size={11} color={C_ACCENT} muted="rgba(255,255,255,.15)"/>;
}

function CTile({ book, lang='pl', size='md', vertical=false }) {
  const isHero = size==='lg';
  const coverW = isHero ? 150 : (vertical ? 104 : 96);
  const coverH = isHero ? 218 : (vertical ? 150 : 140);
  return (
    <div style={{
      background:`linear-gradient(155deg, ${genreBg(book.genre, 0.30)} 0%, ${C_BG2} 60%)`,
      borderRadius:18, padding: isHero ? 18 : 14, position:'relative', overflow:'hidden',
      border:`1px solid ${C_LINE}`,
      display:'flex', flexDirection:'column', gap: isHero ? 16 : 10,
    }}>
      {/* Glow */}
      <div style={{position:'absolute', top:-40, right:-40, width:140, height:140, borderRadius:'50%',
        background:`radial-gradient(circle, ${genreBg(book.genre, 0.45)}, transparent 70%)`, filter:'blur(10px)'}}/>

      <div style={{display:'flex', flexDirection: vertical ? 'column' : 'row',
        alignItems: vertical ? 'center' : 'flex-start',
        gap: isHero ? 18 : (vertical ? 12 : 12), position:'relative'}}>
        <window.RR_Cover book={book} w={coverW} h={coverH} radius={8}/>
        <div style={{
          flex: vertical ? 'none' : 1, width: vertical ? '100%' : 'auto', minWidth:0,
          display:'flex', flexDirection:'column', gap:6,
          alignItems: vertical ? 'center' : 'flex-start',
          textAlign: vertical ? 'center' : 'left',
        }}>
          <CGenreTag genre={book.genre} lang={lang}/>
          <div style={{
            fontFamily:C_SANS, fontWeight:700, fontSize: isHero ? 22 : 15, lineHeight:1.1,
            color:C_INK, letterSpacing:'-.02em', maxWidth:'100%',
            display:'-webkit-box', WebkitLineClamp: isHero ? 3 : 2, WebkitBoxOrient:'vertical', overflow:'hidden',
          }}>{book.title}</div>
          <div style={{fontFamily:C_SANS, fontSize: isHero ? 13 : 11.5, color:C_MUTED, maxWidth:'100%',
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace: vertical ? 'normal' : 'nowrap'}}>
            {book.author}
          </div>
          <div style={{marginTop:2}}><CMeta book={book} lang={lang}/></div>
        </div>
      </div>

      {/* Progress */}
      <div style={{position:'relative'}}>
        <div style={{display:'flex', justifyContent:'space-between', fontFamily:C_MONO, fontSize:10, color:C_MUTED, letterSpacing:'.08em', marginBottom:5}}>
          <span>{lang==='pl'?'POSTĘP':'PROGRESS'}</span>
          <span style={{color:genreFg(book.genre), fontWeight:700}}>{book.progress}%</span>
        </div>
        <div style={{height: isHero ? 6 : 4, background:'rgba(255,255,255,.08)', borderRadius:99, overflow:'hidden'}}>
          <div style={{height:'100%', width:`${book.progress}%`,
            background:genreFg(book.genre), borderRadius:99}}/>
        </div>
      </div>
    </div>
  );
}

function CQueueChip({ book, lang='pl' }) {
  return (
    <div style={{
      flex:'0 0 168px', background:C_BG2, borderRadius:14, padding:12,
      border:`1px solid ${C_LINE}`, position:'relative', overflow:'hidden',
      display:'flex', flexDirection:'column', gap:10,
    }}>
      <div style={{position:'absolute', top:-30, right:-30, width:90, height:90, borderRadius:'50%',
        background:`radial-gradient(circle, ${genreBg(book.genre, 0.6)}, transparent 70%)`, filter:'blur(8px)'}}/>
      <div style={{position:'relative', display:'flex', justifyContent:'center', paddingBlock:4}}>
        <window.RR_Cover book={book} w={120} h={170} radius={6}/>
      </div>
      <div style={{position:'relative'}}>
        <CGenreTag genre={book.genre} lang={lang}/>
        <div style={{fontFamily:C_SANS, fontWeight:700, fontSize:13, lineHeight:1.15, color:C_INK, marginTop:6, letterSpacing:'-.01em',
          display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden'}}>{book.title}</div>
        <div style={{fontFamily:C_SANS, fontSize:11, color:C_MUTED, marginTop:2}}>{book.author}</div>
      </div>
    </div>
  );
}

function CReadCard({ book, lang='pl' }) {
  return (
    <div style={{
      position:'relative', borderRadius:12, overflow:'hidden',
      background:C_BG2, border:`1px solid ${C_LINE}`,
      display:'flex', flexDirection:'column', minHeight:0,
    }}>
      {/* genre top stripe */}
      <div style={{height:3, background:genreFg(book.genre), opacity:.9}}/>
      <div style={{padding:10, display:'flex', flexDirection:'column', gap:8}}>
        <div style={{display:'flex', justifyContent:'center', position:'relative'}}>
          <div style={{position:'absolute', inset:'auto 0 -10px 0', height:40, filter:'blur(14px)',
            background:`radial-gradient(ellipse, ${genreBg(book.genre, 0.7)}, transparent 60%)`}}/>
          <window.RR_Cover book={book} w={104} h={150} radius={5}/>
        </div>
        <div style={{display:'flex', flexDirection:'column', alignItems:'flex-start', gap:6}}>
          <CGenreTag genre={book.genre} lang={lang}/>
          <CStars value={book.rating}/>
        </div>
        <div>
          <div style={{fontFamily:C_SANS, fontWeight:700, fontSize:13, lineHeight:1.15, color:C_INK, letterSpacing:'-.01em',
            display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', minHeight:30}}>{book.title}</div>
          <div style={{fontFamily:C_SANS, fontSize:11, color:C_MUTED, marginTop:2}}>{book.author}</div>
        </div>
        <CMeta book={book} lang={lang}/>
      </div>
    </div>
  );
}

function CPill({ active, onClick, children, hue }) {
  const bg = active ? (hue!=null ? `oklch(0.50 0.18 ${hue} / 0.85)` : C_ACCENT) : 'rgba(255,255,255,.04)';
  const color = active ? '#0B0820' : C_INK;
  const border = active ? 'transparent' : C_LINE;
  return <button onClick={onClick} style={{
    fontFamily:C_MONO, fontSize:11, fontWeight:500, letterSpacing:'.06em', textTransform:'uppercase',
    padding:'6px 11px', borderRadius:999, cursor:'pointer', whiteSpace:'nowrap',
    border:`1px solid ${border}`, background:bg, color:color,
  }}>{children}</button>;
}

// Segmented control — used for the "refine" facets (język / format / ocena),
// visually distinct from the genre browse chips. One option always selected;
// the leading "Wsz." option clears the facet.
function CSegment({ label, options, value, onChange }) {
  return (
    <div style={{display:'flex', alignItems:'center', gap:10}}>
      <span style={{fontFamily:C_MONO, fontSize:10, color:C_MUTED, letterSpacing:'.14em', textTransform:'uppercase'}}>{label}</span>
      <div style={{display:'inline-flex', background:'rgba(255,255,255,.04)', border:`1px solid ${C_LINE}`,
        borderRadius:999, padding:3, gap:2}}>
        {options.map(o => {
          const active = value===o.val;
          return (
            <button key={String(o.val)} onClick={()=>onChange(o.val)} style={{
              fontFamily:C_MONO, fontSize:11, fontWeight:500, letterSpacing:'.04em', whiteSpace:'nowrap',
              padding:'5px 12px', borderRadius:999, cursor:'pointer', border:'none',
              background: active ? C_ACCENT : 'transparent',
              color: active ? '#0B0820' : C_INK,
            }}>{o.node}</button>
          );
        })}
      </div>
    </div>
  );
}

// Bold, clearly-separated section identity. The section name is the hero;
// no item counts (quality over quantity). A glowing marker color-codes the
// shelf state: violet = reading now, amber = up next, green = finished.
const C_MARKER = { now:'#A78BFA', next:'#F59E0B', read:'#34D399' };
function CSectionHeader({ title, marker='now', scale=1, line=true }) {
  const c = C_MARKER[marker] || C_ACCENT;
  return (
    <div style={{display:'flex', alignItems:'center', gap:13*scale, marginBottom:18*scale}}>
      <span style={{
        width:11*scale, height:11*scale, borderRadius:3, background:c, flexShrink:0,
        boxShadow:`0 0 14px ${c}, 0 0 4px ${c}`,
      }}/>
      <h2 style={{
        margin:0, fontFamily:C_SANS, fontWeight:700, fontSize:30*scale,
        letterSpacing:'-.03em', color:C_INK, whiteSpace:'nowrap',
      }}>{title}</h2>
      {line && <span style={{flex:1, height:1, background:C_LINE, minWidth:16}}/>}
    </div>
  );
}

function CHeader({ lang, setLang, scale=1, wm=24 }) {
  return (
    <header style={{display:'flex', alignItems:'center', gap:14, paddingBlock:14*scale}}>
      <div style={{
        width:40*scale, height:40*scale, borderRadius:12,
        background:`conic-gradient(from 180deg, #A78BFA, #EC4899, #F59E0B, #10B981, #A78BFA)`,
        display:'grid', placeItems:'center', padding:2,
      }}>
        <div style={{width:'100%', height:'100%', borderRadius:10, background:C_BG, display:'grid', placeItems:'center',
          fontFamily:C_SANS, fontWeight:700, fontSize:16*scale, color:C_INK}}>R</div>
      </div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontFamily:C_SANS, fontWeight:700, fontSize:wm*scale, letterSpacing:'-.03em', color:C_INK}}>
          radek.czyta
        </div>
        <div style={{fontFamily:C_MONO, fontSize:10*scale, color:C_MUTED, letterSpacing:'.08em', textTransform:'uppercase'}}>
          {lang==='pl' ? 'Półka · 2026' : 'Shelf · 2026'}
        </div>
      </div>
      <a href="#o-mnie" style={{
        height:32*scale, display:'inline-flex', alignItems:'center', paddingInline:12, borderRadius:999,
        border:`1px solid ${C_LINE}`, background:'rgba(255,255,255,.04)', textDecoration:'none',
        color:C_INK, fontFamily:C_MONO, fontSize:11*scale, fontWeight:500, letterSpacing:'.08em', textTransform:'uppercase',
      }}>{lang==='pl' ? 'O mnie' : 'About'}</a>
      <button onClick={()=>setLang(lang==='pl'?'en':'pl')} style={{
        height:32*scale, paddingInline:12, borderRadius:999, border:`1px solid ${C_LINE}`, background:'rgba(255,255,255,.04)',
        cursor:'pointer', color:C_INK, fontFamily:C_MONO, fontSize:11*scale, fontWeight:500, letterSpacing:'.08em',
      }}>{lang==='pl' ? 'PL' : 'EN'}</button>
    </header>
  );
}

// ─── MOBILE ────────────────────────────────────────────────────────
window.RR_VariantC_Mobile = function VariantCMobile() {
  const rrCtx = React.useContext(window.RR_Context);
  const [langState, setLang] = React.useState('pl');
  const lang = rrCtx?.langOverride || langState;
  const reading = window.RR_BOOKS.filter(b=>b.shelf==='reading');
  const queue   = window.RR_BOOKS.filter(b=>b.shelf==='queue');
  const read    = window.RR_BOOKS.filter(b=>b.shelf==='read');
  const f = window.RR_useFilters(read);
  const [showFilters, setShowFilters] = React.useState(false);
  const refineCount = (f.lang!=='all'?1:0) + (f.format!=='all'?1:0) + (f.minRating!==0?1:0);

  const L = lang==='pl' ? { now:'Teraz czytam', next:'Następne', read:'Przeczytane', all:'ALL', search:'Szukaj…' } :
                          { now:'Reading now', next:'Up next', read:'Finished',  all:'ALL', search:'Search…' };

  return (
    <div style={{
      width:'100%', minHeight:'100%', background:C_BG, color:C_INK,
      fontFamily:C_SANS, paddingInline:16, paddingBottom:30,
      backgroundImage:`radial-gradient(circle at 20% 0%, rgba(167,139,250,.10), transparent 50%),
                       radial-gradient(circle at 100% 30%, rgba(236,72,153,.06), transparent 50%)`,
    }}>
      <CHeader lang={lang} setLang={setLang} scale={1}/>

      {/* Big tagline */}
      <div style={{paddingBlock:6, marginBottom:14}}>
        <h1 style={{margin:0, fontFamily:C_SANS, fontWeight:700, fontSize:28, lineHeight:.98, letterSpacing:'-.03em', color:C_INK}}>
          {lang==='pl' ? <>Książki, które<br/><em style={{fontStyle:'italic', color:C_ACCENT}}>teraz pożeram</em>.</> :
                        <>Books I am <em style={{fontStyle:'italic', color:C_ACCENT}}>devouring</em> right now.</>}
        </h1>
      </div>

      {/* Reading bento */}
      <section style={{marginBottom:28}}>
        <CSectionHeader title={L.now} marker="now" scale={0.82}/>
        <div style={{display:'flex', flexDirection:'column', gap:10}}>
          {reading.slice(0,1).map(b => <CTile key={b.id} book={b} lang={lang} size="lg" vertical/>)}
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
            {reading.slice(1).map(b => <CTile key={b.id} book={b} lang={lang} size="md" vertical/>)}
          </div>
        </div>
      </section>

      {/* Queue scroll */}
      <section style={{marginBottom:28}}>
        <CSectionHeader title={L.next} marker="next" scale={0.82}/>
        <div style={{position:'relative', marginInline:-16}}>
          <div className="rr-hide-scroll" style={{display:'flex', gap:10, overflowX:'auto', paddingInline:16, paddingRight:44, paddingBlock:4}}>
            {queue.map(b => <CQueueChip key={b.id} book={b} lang={lang}/>)}
          </div>
          <div style={{position:'absolute', top:0, right:0, bottom:0, width:72, pointerEvents:'none',
            background:`linear-gradient(90deg, rgba(11,8,32,0), ${C_BG} 72%)`}}/>
        </div>
      </section>

      {/* Read */}
      <section>
        <CSectionHeader title={L.read} marker="read" scale={0.82}/>

        <div style={{fontFamily:C_MONO, fontSize:10, color:C_MUTED, letterSpacing:'.14em',
          textTransform:'uppercase', marginTop:2, marginBottom:6}}>{lang==='pl'?'Gatunek':'Genre'}</div>
        <div className="rr-hide-scroll" style={{display:'flex', gap:6, overflowX:'auto', marginInline:-16, paddingInline:16, paddingBlock:4}}>
          <CPill active={f.genre==='all'} onClick={()=>f.setGenre('all')}>{lang==='pl'?'Wszystkie':'All'}</CPill>
          {Object.entries(window.RR_GENRES).map(([k,g]) => (
            <CPill key={k} active={f.genre===k} hue={g.hue} onClick={()=>f.setGenre(k)}>{g[lang]}</CPill>
          ))}
        </div>
        <button onClick={()=>setShowFilters(s=>!s)} style={{
          display:'inline-flex', alignItems:'center', gap:8, marginTop:12,
          fontFamily:C_MONO, fontSize:11, fontWeight:500, letterSpacing:'.06em', textTransform:'uppercase',
          padding:'8px 13px', borderRadius:999, cursor:'pointer', color:C_INK,
          border:`1px solid ${refineCount>0 ? 'transparent' : C_LINE}`,
          background: refineCount>0 ? 'rgba(167,139,250,.16)' : 'rgba(255,255,255,.04)',
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/>
          </svg>
          {lang==='pl'?'Filtry':'Filters'}
          {refineCount>0 && <span style={{minWidth:17, height:17, paddingInline:4, borderRadius:999,
            background:C_ACCENT, color:'#0B0820', fontFamily:C_MONO, fontSize:10, fontWeight:700,
            display:'inline-flex', alignItems:'center', justifyContent:'center'}}>{refineCount}</span>}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C_MUTED} strokeWidth="2"
            style={{marginLeft:2, transform:showFilters?'rotate(180deg)':'none', transition:'transform .2s'}}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        {showFilters && (
        <div className="rr-hide-scroll" style={{display:'flex', flexDirection:'column', gap:10, marginTop:12, marginBottom:8, overflowX:'auto', marginInline:-16, paddingInline:16}}>
          <CSegment label={lang==='pl'?'Język':'Language'} value={f.lang} onChange={f.setLang}
            options={[{val:'all', node:lang==='pl'?'Wsz.':'All'}, {val:'pl', node:'PL'}, {val:'en', node:'EN'}]}/>
          <CSegment label={lang==='pl'?'Format':'Format'} value={f.format} onChange={f.setFormat}
            options={[{val:'all', node:lang==='pl'?'Wsz.':'All'}, {val:'audiobook', node:'Audio'}, {val:'ebook', node:'Ebook'}, {val:'paper', node:lang==='pl'?'Papier':'Paper'}]}/>
          <CSegment label={lang==='pl'?'Ocena':'Rating'} value={f.minRating} onChange={f.setMinRating}
            options={[{val:0, node:lang==='pl'?'Wsz.':'All'}, {val:4, node:'4★+'}, {val:5, node:'5★'}]}/>
        </div>
        )}

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:6}}>
          {f.filtered.map(b => <CReadCard key={b.id} book={b} lang={lang}/>)}
        </div>
      </section>
    </div>
  );
};

// ─── DESKTOP ───────────────────────────────────────────────────────
window.RR_VariantC_Desktop = function VariantCDesktop() {
  const rrCtx = React.useContext(window.RR_Context);
  const [langState, setLang] = React.useState('pl');
  const lang = rrCtx?.langOverride || langState;
  const reading = window.RR_BOOKS.filter(b=>b.shelf==='reading');
  const queue   = window.RR_BOOKS.filter(b=>b.shelf==='queue');
  const read    = window.RR_BOOKS.filter(b=>b.shelf==='read');
  const f = window.RR_useFilters(read);

  const L = lang==='pl' ? { now:'Teraz czytam', next:'Następne', read:'Przeczytane', all:'ALL', search:'Szukaj tytułu lub autora…',
    tagline: <>Książki, które <em style={{fontStyle:'italic', color:C_ACCENT}}>teraz pożeram</em> — i te które się rozłożyły na półce.</>} :
    { now:'Reading now', next:'Up next', read:'Finished', all:'ALL', search:'Search title or author…',
    tagline: <>Books I am <em style={{fontStyle:'italic', color:C_ACCENT}}>devouring</em> — and the ones that landed on the shelf.</>};

  return (
    <div style={{
      minHeight:'100%', background:C_BG, color:C_INK, fontFamily:C_SANS,
      paddingInline:48, paddingBottom:60,
      backgroundImage:`radial-gradient(circle at 10% 0%, rgba(167,139,250,.12), transparent 40%),
                       radial-gradient(circle at 90% 20%, rgba(236,72,153,.08), transparent 40%),
                       radial-gradient(circle at 50% 80%, rgba(16,185,129,.05), transparent 50%)`,
    }}>
      <CHeader lang={lang} setLang={setLang} wm={17}/>

      <h1 style={{margin:'14px 0 28px', fontFamily:C_SANS, fontWeight:700, fontSize:50, lineHeight:.98, letterSpacing:'-.04em', color:C_INK, maxWidth:900}}>
        {L.tagline}
      </h1>

      {/* Reading bento */}
      <section style={{marginBottom:40}}>
        <CSectionHeader title={L.now} marker="now"/>
        <div style={{display:'grid', gridTemplateColumns:'1.5fr 1fr 1fr', gap:14, gridAutoRows:'minmax(0,1fr)'}}>
          {reading[0] && <div style={{gridRow:'span 2'}}><CTile book={reading[0]} lang={lang} size="lg"/></div>}
          {reading.slice(1,5).map(b => <CTile key={b.id} book={b} lang={lang} size="md"/>)}
        </div>
      </section>

      {/* Queue — scrollbar hidden; overflow signalled by right-edge fade + a peeking next card */}
      <section style={{marginBottom:44}}>
        <CSectionHeader title={L.next} marker="next"/>
        <div style={{position:'relative'}}>
          <div className="rr-hide-scroll" style={{display:'flex', gap:14, overflowX:'auto', paddingBlock:4, paddingRight:48}}>
            {queue.map(b => <CQueueChip key={b.id} book={b} lang={lang}/>)}
          </div>
          <div style={{position:'absolute', top:0, right:0, bottom:0, width:72, pointerEvents:'none',
            background:`linear-gradient(90deg, rgba(11,8,32,0), ${C_BG} 85%)`}}/>
        </div>
      </section>

      {/* Read */}
      <section>
        <CSectionHeader title={L.read} marker="read"/>

        {/* Filters — genre as browse chips, refinements as segmented controls */}
        <div style={{display:'flex', flexDirection:'column', gap:14, marginBottom:18}}>
          <div style={{display:'flex', alignItems:'flex-start', gap:14, flexWrap:'wrap'}}>
            <span style={{fontFamily:C_MONO, fontSize:10, color:C_MUTED, letterSpacing:'.14em',
              textTransform:'uppercase', paddingTop:8}}>{lang==='pl'?'Gatunek':'Genre'}</span>
            <div style={{display:'flex', gap:6, flexWrap:'wrap', flex:1, minWidth:0}}>
              <CPill active={f.genre==='all'} onClick={()=>f.setGenre('all')}>{lang==='pl'?'Wszystkie':'All'}</CPill>
              {Object.entries(window.RR_GENRES).map(([k,g]) => (
                <CPill key={k} active={f.genre===k} hue={g.hue} onClick={()=>f.setGenre(k)}>{g[lang]}</CPill>
              ))}
            </div>
          </div>
          <div style={{display:'flex', gap:22, rowGap:12, flexWrap:'wrap', alignItems:'center'}}>
            <CSegment label={lang==='pl'?'Język':'Language'} value={f.lang} onChange={f.setLang}
              options={[{val:'all', node:lang==='pl'?'Wsz.':'All'}, {val:'pl', node:'PL'}, {val:'en', node:'EN'}]}/>
            <CSegment label={lang==='pl'?'Format':'Format'} value={f.format} onChange={f.setFormat}
              options={[{val:'all', node:lang==='pl'?'Wsz.':'All'}, {val:'audiobook', node:'Audio'}, {val:'ebook', node:'Ebook'}, {val:'paper', node:lang==='pl'?'Papier':'Paper'}]}/>
            <CSegment label={lang==='pl'?'Ocena':'Rating'} value={f.minRating} onChange={f.setMinRating}
              options={[{val:0, node:lang==='pl'?'Wsz.':'All'}, {val:4, node:'4★+'}, {val:5, node:'5★'}]}/>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:14}}>
          {f.filtered.map(b => <CReadCard key={b.id} book={b} lang={lang}/>)}
        </div>
      </section>
    </div>
  );
};
