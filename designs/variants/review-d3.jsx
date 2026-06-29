// Design 3 — "Verdict bento"
// Scannable, card-based. A bento grid up top puts the cover, a verdict tile
// (big rating + one-liner), a quick who/not-who tile and the buy-links tile
// side by side. The review follows as stacked cards, one per section, each
// with a genre top-stripe. Most structured of the three.

const D3 = window.RV;

function D3Card({ children, hue, stripe=false, style }) {
  return (
    <div style={{
      position:'relative', borderRadius:16, overflow:'hidden', background:D3.BG2,
      border:`1px solid ${D3.LINE}`, ...style,
    }}>
      {stripe && <div style={{height:3, background:`oklch(0.78 0.15 ${hue})`, opacity:.9}}/>}
      {children}
    </div>
  );
}

function D3SectionHeader({ title, hue, scale=1 }) {
  return (
    <h2 style={{margin:`0 0 ${12*scale}px`, fontFamily:D3.SANS, fontWeight:700, fontSize:23*scale,
      letterSpacing:'-.025em', color:D3.INK, lineHeight:1.1}}>{title}</h2>
  );
}
function D3H3({ children, hue, scale=1 }) {
  return <h3 style={{margin:`${18*scale}px 0 ${6*scale}px`, fontFamily:D3.MONO, fontWeight:500,
    fontSize:11*scale, letterSpacing:'.12em', textTransform:'uppercase',
    color:`oklch(0.8 0.14 ${hue})`}}>{children}</h3>;
}
function D3P({ children, scale=1 }) {
  return <p style={{margin:`0 0 ${12*scale}px`, fontFamily:D3.SANS, fontSize:15.5*scale, lineHeight:1.6,
    color:'#D2CDE9', textWrap:'pretty'}}>{children}</p>;
}

function D3Body({ review, lang, state, hue, scale=1, mobile=false }) {
  if (state !== 'review') {
    return <window.RV_StateNote state={state} lang={lang} hue={hue}/>;
  }
  return (
    <div style={{display:'flex', flexDirection:'column', gap:14}}>
      {review.sections.map(sec => (
        <D3Card key={sec.key} hue={hue} stripe>
          <div style={{padding: mobile?'18px 18px 6px':'24px 28px 12px'}}>
            <D3SectionHeader title={sec.title[lang]} hue={hue} scale={scale}/>
            {sec.key==='mine' && (
              <div style={{marginBottom:12}}><window.RV_Rating value={review.rating} genre={review && null} lang={lang} size={17}/></div>
            )}
            {sec.blocks.map((b,i) => b.h3
              ? <D3H3 key={i} hue={hue} scale={scale}>{b.h3[lang]}</D3H3>
              : <D3P key={i} scale={scale}>{b.p[lang]}</D3P>)}
          </div>
        </D3Card>
      ))}
    </div>
  );
}

// quick "who it's for / not for" verdict chips, pulled from the review sections
function D3Verdict({ review, lang, hue }) {
  const who = review.sections.find(s=>s.key==='who');
  const notwho = review.sections.find(s=>s.key==='notwho');
  const firstP = sec => (sec.blocks.find(b=>b.p)||{}).p?.[lang] || '';
  const clamp = (t,n=110) => t.length>n ? t.slice(0,n).replace(/\s+\S*$/,'')+'…' : t;
  return (
    <div style={{display:'flex', flexDirection:'column', gap:12, height:'100%'}}>
      {[{ic:'+', label: lang==='pl'?'Dla kogo':'For whom', t:firstP(who), good:true},
        {ic:'–', label: lang==='pl'?'Nie dla':'Not for', t:firstP(notwho), good:false}].map((row,i)=>(
        <div key={i} style={{display:'flex', gap:11, alignItems:'flex-start'}}>
          <span style={{flexShrink:0, width:22, height:22, borderRadius:6, display:'grid', placeItems:'center',
            fontFamily:D3.SANS, fontWeight:700, fontSize:15, marginTop:1,
            background: row.good?'oklch(0.55 0.15 150 / .2)':'oklch(0.55 0.16 20 / .2)',
            color: row.good?'oklch(0.82 0.15 150)':'oklch(0.82 0.16 20)'}}>{row.ic}</span>
          <div>
            <div style={{fontFamily:D3.MONO, fontSize:10, color:D3.MUTED, letterSpacing:'.12em',
              textTransform:'uppercase', marginBottom:3}}>{row.label}</div>
            <div style={{fontFamily:D3.SANS, fontSize:13.5, lineHeight:1.45, color:'#CFC9EA'}}>{clamp(row.t)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function D3CoverTile({ book, lang, hue }) {
  return (
    <D3Card hue={hue} style={{display:'flex', flexDirection:'column'}}>
      <div style={{position:'relative', display:'flex', justifyContent:'center', padding:'20px 16px 16px'}}>
        <div style={{position:'absolute', inset:'auto 0 0 0', height:90, filter:'blur(26px)',
          background:`radial-gradient(ellipse at bottom, ${window.RV_genreBg(book.genre,0.7)}, transparent 65%)`}}/>
        <div style={{position:'relative'}}><window.RR_Cover book={book} w={150} h={218} radius={8}/></div>
      </div>
    </D3Card>
  );
}

function D3VerdictTile({ book, review, lang, state, hue }) {
  return (
    <D3Card hue={hue} stripe style={{padding:'18px 20px', display:'flex', flexDirection:'column', gap:12}}>
      <div style={{display:'flex', flexWrap:'wrap', alignItems:'baseline', gap:10}}>
        <window.RV_GenreTag genre={book.genre} lang={lang}/>
        <window.RV_MetaInline book={book} lang={lang} size={11}/>
      </div>
      <h1 style={{margin:0, fontFamily:D3.SANS, fontWeight:700, fontSize:26, lineHeight:1.08,
        letterSpacing:'-.03em', color:D3.INK}}>{book.title}</h1>
      <div style={{fontFamily:D3.SANS, fontSize:14.5, color:D3.MUTED, marginTop:-4}}>{book.author}</div>
      <div style={{marginTop:'auto', paddingTop:8}}>
        {state==='reading'
          ? <window.RV_Progress value={book.progress||40} genre={book.genre} lang={lang}/>
          : (
            <div style={{display:'flex', alignItems:'center', gap:14}}>
              <span style={{fontFamily:D3.SANS, fontSize:40, fontWeight:700, lineHeight:1,
                color:`oklch(0.86 0.15 ${hue})`}}>{review.rating}<span style={{fontSize:20, color:D3.MUTED, fontWeight:500}}>/5</span></span>
              <window.RV_Stars value={review.rating} size={17} genre={book.genre}/>
            </div>
          )}
        {state!=='reading' && (
          <div style={{marginTop:10, fontFamily:D3.SANS, fontSize:14, fontStyle:'italic', color:'#C9C3E6', lineHeight:1.45}}>
            „{review.tldr[lang]}”
          </div>
        )}
      </div>
    </D3Card>
  );
}

window.RR_ReviewD3 = function ReviewD3({ variant='desktop', lang='pl', state='review', which='both' }) {
  const book = window.RR_BOOKS.find(b => b.id === window.RR_REVIEW.bookId);
  const review = window.RR_REVIEW;
  const hue = window.RV_genreHue(book.genre);
  const mobile = variant==='mobile';

  return (
    <div style={{
      width:'100%', minHeight:'100%', background:D3.BG, color:D3.INK, fontFamily:D3.SANS,
      paddingInline: mobile?16:44, paddingTop: mobile?16:28, paddingBottom: mobile?40:64, boxSizing:'border-box',
      backgroundImage:`radial-gradient(circle at 85% 0%, ${window.RV_genreBg(book.genre,0.12)}, transparent 45%)`,
    }}>
      <div style={{marginBottom: mobile?16:24}}>
        <window.RV_PageHeader lang={lang}/>
      </div>

      {/* bento */}
      {mobile ? (
        <div style={{display:'flex', flexDirection:'column', gap:12, marginBottom:22}}>
          <D3VerdictTile book={book} review={review} lang={lang} state={state} hue={hue}/>
          <div style={{display:'grid', gridTemplateColumns:'150px 1fr', gap:12, alignItems:'stretch'}}>
            <D3CoverTile book={book} lang={lang} hue={hue}/>
            <D3Card hue={hue} style={{padding:'16px 16px'}}>
              {state==='review'
                ? <D3Verdict review={review} lang={lang} hue={hue}/>
                : <window.RV_StateNote state={state} lang={lang} hue={hue}/>}
            </D3Card>
          </div>
          <D3Card hue={hue} style={{padding:18}}>
            <window.RV_BuyLinks bookId={review.bookId} lang={lang} which={which} hue={hue} layout="col"/>
          </D3Card>
        </div>
      ) : (
        <div style={{display:'grid', gridTemplateColumns:'200px 1fr 1.1fr', gap:14, marginBottom:26, alignItems:'stretch'}}>
          <D3CoverTile book={book} lang={lang} hue={hue}/>
          <D3VerdictTile book={book} review={review} lang={lang} state={state} hue={hue}/>
          <div style={{display:'grid', gridTemplateRows:'auto auto', gap:14}}>
            <D3Card hue={hue} style={{padding:'18px 20px'}}>
              {state==='review'
                ? <D3Verdict review={review} lang={lang} hue={hue}/>
                : <window.RV_StateNote state={state} lang={lang} hue={hue}/>}
            </D3Card>
            <D3Card hue={hue} style={{padding:'18px 20px'}}>
              <window.RV_BuyLinks bookId={review.bookId} lang={lang} which={which} hue={hue} layout="row"/>
            </D3Card>
          </div>
        </div>
      )}

      <div style={{maxWidth: mobile?'none':960, marginInline:'auto'}}>
        <D3Body review={review} lang={lang} state={state} hue={hue} scale={1} mobile={mobile}/>
      </div>
    </div>
  );
};
