// Design 1 — "Dossier"
// Two-column detail page: a sticky cover rail (cover, meta, rating/progress,
// buy links) on the left; the long-form review on the right with a generous
// reading measure. On mobile it stacks: hero → buy links → review.

const D1 = window.RV;

function D1SectionHeader({ title, hue, scale=1 }) {
  return (
    <div style={{display:'flex', alignItems:'center', gap:12*scale, marginBottom:14*scale, marginTop:0}}>
      <span style={{width:9*scale, height:9*scale, borderRadius:2, flexShrink:0,
        background:`oklch(0.82 0.16 ${hue})`, boxShadow:`0 0 12px oklch(0.82 0.16 ${hue} / .8)`}}/>
      <h2 style={{margin:0, fontFamily:D1.SANS, fontWeight:700, fontSize:26*scale,
        letterSpacing:'-.03em', color:D1.INK, lineHeight:1.05}}>{title}</h2>
    </div>
  );
}
function D1H3({ children, scale=1 }) {
  return <h3 style={{margin:`${22*scale}px 0 ${6*scale}px`, fontFamily:D1.MONO, fontWeight:500,
    fontSize:12*scale, letterSpacing:'.12em', textTransform:'uppercase', color:D1.ACCENT}}>{children}</h3>;
}
function D1P({ children, scale=1 }) {
  return <p style={{margin:`0 0 ${14*scale}px`, fontFamily:D1.SANS, fontSize:16*scale, lineHeight:1.62,
    color:'#D8D3F0', textWrap:'pretty'}}>{children}</p>;
}

function D1Body({ review, lang, state, hue, scale=1 }) {
  if (state !== 'review') {
    return <div style={{marginTop:8}}><window.RV_StateNote state={state} lang={lang} hue={hue}/></div>;
  }
  return (
    <div style={{display:'flex', flexDirection:'column', gap:34*scale}}>
      {review.sections.map(sec => (
        <section key={sec.key}>
          <D1SectionHeader title={sec.title[lang]} hue={hue} scale={scale}/>
          {sec.key==='mine' && (
            <div style={{marginBottom:14*scale}}><window.RV_Rating value={review.rating} genre={null} lang={lang} size={18*scale}/></div>
          )}
          {sec.blocks.map((b,i) => b.h3
            ? <D1H3 key={i} scale={scale}>{b.h3[lang]}</D1H3>
            : <D1P key={i} scale={scale}>{b.p[lang]}</D1P>)}
        </section>
      ))}
    </div>
  );
}

function D1Rail({ book, review, lang, state, which, hue, scale=1, sticky=true }) {
  return (
    <aside style={{
      position: sticky ? 'sticky' : 'static', top:28,
      display:'flex', flexDirection:'column', gap:20*scale,
    }}>
      <div style={{position:'relative', display:'flex', justifyContent:'center', paddingTop:8}}>
        <div style={{position:'absolute', inset:'10% 10% -6% 10%', filter:'blur(34px)', borderRadius:'50%',
          background:`radial-gradient(ellipse, ${window.RV_genreBg(book.genre,0.65)}, transparent 70%)`}}/>
        <div style={{position:'relative'}}>
          <window.RR_Cover book={book} w={200*scale} h={290*scale} radius={10}/>
        </div>
      </div>

      <div style={{display:'flex', flexDirection:'column', gap:10*scale}}>
        <window.RV_GenreTag genre={book.genre} lang={lang}/>
        <h1 style={{margin:0, fontFamily:D1.SANS, fontWeight:700, fontSize:26*scale, lineHeight:1.08,
          letterSpacing:'-.03em', color:D1.INK}}>{book.title}</h1>
        <div style={{fontFamily:D1.SANS, fontSize:15*scale, color:D1.MUTED}}>{book.author}</div>
        <div style={{marginTop:2}}><window.RV_MetaInline book={book} lang={lang}/></div>
        <div style={{marginTop:6}}>
          {state==='reading'
            ? <window.RV_Progress value={book.progress||40} genre={book.genre} lang={lang}/>
            : <window.RV_Rating value={review.rating} genre={book.genre} lang={lang} size={18*scale}/>}
        </div>
      </div>

      <div style={{height:1, background:D1.LINE}}/>
      <window.RV_BuyLinks bookId={review.bookId} lang={lang} which={which} hue={hue}
        layout={scale<1?'col':'col'}/>
    </aside>
  );
}

// book-detail page, both breakpoints
window.RR_ReviewD1 = function ReviewD1({ variant='desktop', lang='pl', state='review', which='both' }) {
  const book = window.RR_BOOKS.find(b => b.id === window.RR_REVIEW.bookId);
  const review = window.RR_REVIEW;
  const hue = window.RV_genreHue(book.genre);
  const mobile = variant==='mobile';

  return (
    <div style={{
      width:'100%', minHeight:'100%', background:D1.BG, color:D1.INK, fontFamily:D1.SANS,
      paddingInline: mobile?18:48, paddingTop: mobile?16:28, paddingBottom: mobile?40:64, boxSizing:'border-box',
      backgroundImage:`radial-gradient(circle at ${mobile?'30%':'18%'} 0%, ${window.RV_genreBg(book.genre,0.14)}, transparent 45%)`,
    }}>
      <div style={{marginBottom: mobile?18:26}}>
        <window.RV_PageHeader lang={lang}/>
      </div>

      {mobile ? (
        <div style={{display:'flex', flexDirection:'column', gap:30}}>
          <D1Rail book={book} review={review} lang={lang} state={state} which={which} hue={hue} scale={0.92} sticky={false}/>
          <div style={{height:1, background:D1.LINE}}/>
          <D1Body review={review} lang={lang} state={state} hue={hue} scale={0.94}/>
        </div>
      ) : (
        <div style={{display:'grid', gridTemplateColumns:'320px 1fr', gap:56, alignItems:'start'}}>
          <D1Rail book={book} review={review} lang={lang} state={state} which={which} hue={hue}/>
          <div style={{maxWidth:680, paddingTop:8}}>
            <D1Body review={review} lang={lang} state={state} hue={hue}/>
          </div>
        </div>
      )}
    </div>
  );
};
