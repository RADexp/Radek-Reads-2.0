// Design 2 — "Editorial"
// A literary-magazine treatment: a full-width genre-tinted hero band with the
// cover floating over it, a big rating, then the review in a single centered
// column set in a reading serif (Newsreader). Buy links sit in a wide rail
// under the hero. Quietly different from the app-like Variant C.

const D2 = window.RV;

function D2SectionHeader({ title, index, hue, scale=1 }) {
  return (
    <div style={{marginBottom:16*scale, marginTop:0}}>
      <div style={{fontFamily:D2.MONO, fontSize:11*scale, letterSpacing:'.2em', textTransform:'uppercase',
        color:`oklch(0.78 0.14 ${hue})`, marginBottom:8*scale}}>
        {String(index).padStart(2,'0')}
      </div>
      <h2 style={{margin:0, fontFamily:D2.SERIF, fontWeight:500, fontSize:32*scale, lineHeight:1.12,
        letterSpacing:'-.01em', color:D2.INK}}>{title}</h2>
      <div style={{width:48*scale, height:2, background:`oklch(0.7 0.16 ${hue})`, marginTop:14*scale}}/>
    </div>
  );
}
function D2H3({ children, scale=1 }) {
  return <h3 style={{margin:`${24*scale}px 0 ${8*scale}px`, fontFamily:D2.SERIF, fontStyle:'italic',
    fontWeight:500, fontSize:21*scale, letterSpacing:'-.01em', color:D2.INK}}>{children}</h3>;
}
function D2P({ children, scale=1, lead=false }) {
  return <p style={{margin:`0 0 ${16*scale}px`, fontFamily:D2.SERIF,
    fontSize:(lead?20:17.5)*scale, lineHeight:1.62, color: lead?'#E7E3F6':'#CFC9EA',
    fontWeight:400, textWrap:'pretty'}}>{children}</p>;
}

function D2Body({ review, lang, state, hue, scale=1 }) {
  if (state !== 'review') {
    return <div style={{marginTop:8}}><window.RV_StateNote state={state} lang={lang} hue={hue}/></div>;
  }
  return (
    <div style={{display:'flex', flexDirection:'column', gap:44*scale}}>
      {review.sections.map((sec,idx) => (
        <section key={sec.key}>
          <D2SectionHeader title={sec.title[lang]} index={idx+1} hue={hue} scale={scale}/>
          {sec.blocks.map((b,i) => b.h3
            ? <D2H3 key={i} scale={scale}>{b.h3[lang]}</D2H3>
            : <D2P key={i} scale={scale} lead={sec.key==='mine'&&i===0}>{b.p[lang]}</D2P>)}
        </section>
      ))}
    </div>
  );
}

function D2Hero({ book, review, lang, state, hue, scale=1, mobile=false }) {
  return (
    <div style={{
      position:'relative', borderRadius:20, overflow:'hidden',
      border:`1px solid ${D2.LINE}`,
      background:`linear-gradient(150deg, ${window.RV_genreBg(book.genre,0.42)} 0%, ${D2.BG2} 65%)`,
      padding: mobile?22:'40px 44px',
    }}>
      <div style={{position:'absolute', top:-60, right:-40, width:260, height:260, borderRadius:'50%',
        background:`radial-gradient(circle, ${window.RV_genreBg(book.genre,0.5)}, transparent 70%)`, filter:'blur(20px)'}}/>
      <div style={{position:'relative', display:'flex', flexDirection: mobile?'column':'row',
        alignItems: mobile?'center':'flex-end', gap: mobile?22:40, textAlign: mobile?'center':'left'}}>
        <window.RR_Cover book={book} w={mobile?170:190} h={mobile?246:276} radius={10}/>
        <div style={{flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:14,
          alignItems: mobile?'center':'flex-start', paddingBottom: mobile?0:6}}>
          <window.RV_GenreTag genre={book.genre} lang={lang}/>
          <h1 style={{margin:0, fontFamily:D2.SERIF, fontWeight:500, fontSize: mobile?34:46,
            lineHeight:1.04, letterSpacing:'-.02em', color:D2.INK}}>{book.title}</h1>
          <div style={{fontFamily:D2.SERIF, fontStyle:'italic', fontSize: mobile?17:20, color:D2.MUTED}}>
            {book.author}
          </div>
          <div style={{marginTop:4}}><window.RV_MetaInline book={book} lang={lang} size={12}/></div>
          <div style={{marginTop:6, display:'flex', alignItems:'center', gap:16, flexWrap:'wrap',
            justifyContent: mobile?'center':'flex-start'}}>
            {state==='reading'
              ? <div style={{minWidth: mobile?220:280}}><window.RV_Progress value={book.progress||40} genre={book.genre} lang={lang}/></div>
              : (<>
                  <span style={{fontFamily:D2.SERIF, fontSize:46, fontWeight:500, lineHeight:1,
                    color:`oklch(0.86 0.15 ${hue})`}}>{review.rating.toFixed(1)}</span>
                  <span style={{display:'inline-flex', flexDirection:'column', gap:4}}>
                    <window.RV_Stars value={review.rating} size={16} genre={book.genre}/>
                    <span style={{fontFamily:D2.MONO, fontSize:10, color:D2.MUTED, letterSpacing:'.1em', textTransform:'uppercase'}}>
                      {lang==='pl'?'moja ocena':'my rating'} · {review.rating}/5
                    </span>
                  </span>
                </>)}
          </div>
        </div>
      </div>
    </div>
  );
}

window.RR_ReviewD2 = function ReviewD2({ variant='desktop', lang='pl', state='review', which='both' }) {
  const book = window.RR_BOOKS.find(b => b.id === window.RR_REVIEW.bookId);
  const review = window.RR_REVIEW;
  const hue = window.RV_genreHue(book.genre);
  const mobile = variant==='mobile';

  return (
    <div style={{
      width:'100%', minHeight:'100%', background:D2.BG, color:D2.INK, fontFamily:D2.SANS,
      paddingInline: mobile?16:0, paddingTop: mobile?16:24, paddingBottom: mobile?44:72, boxSizing:'border-box',
    }}>
      <div style={{maxWidth: mobile?'none':820, margin:'0 auto', paddingInline: mobile?0:24}}>
        <div style={{marginBottom:18}}>
          <window.RV_PageHeader lang={lang} context={mobile ? null : (lang==='pl'?'Recenzja':'Review')}/>
        </div>

        <D2Hero book={book} review={review} lang={lang} state={state} hue={hue} mobile={mobile}/>

        {/* buy links rail */}
        <div style={{marginTop:24, marginBottom: mobile?34:48, padding: mobile?18:'22px 26px',
          borderRadius:16, background:D2.BG2, border:`1px solid ${D2.LINE}`}}>
          <window.RV_BuyLinks bookId={review.bookId} lang={lang} which={which} hue={hue} layout={mobile?'col':'row'}/>
        </div>

        <div style={{maxWidth: mobile?'none':680, margin:'0 auto'}}>
          <D2Body review={review} lang={lang} state={state} hue={hue} scale={mobile?0.92:1}/>
        </div>
      </div>
    </div>
  );
};
