// Design 1 — "Czysty" / Minimal airy.
// Monochrome dark, generous negative space, covers centered as the hero.
// Each book: cover, a hairline meta row (format · język) and a thin progress bar.
window.RR_InstaD1 = function InstaD1({ books, lang }){
  const { I_BG, I_INK, I_MUTED, I_LINE, I_SANS, I_MONO } = window.RR_INSTA;
  const n = books.length;
  // Cover height by count so the centered cluster always breathes inside 9:16.
  const coverH = { 1:300, 2:184, 3:170, 4:150 }[n];
  const cols   = n >= 3 ? 2 : 1;

  const Meta = ({ b }) => (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:9, width:coverH*0.69}}>
      <div style={{display:'flex', alignItems:'center', gap:8, fontFamily:I_MONO, fontSize:10.5,
        letterSpacing:'.12em', textTransform:'uppercase', color:I_MUTED}}>
        <span style={{display:'inline-flex', alignItems:'center', gap:5}}>
          <window.RR_FormatIcon format={b.format} size={12} color={I_MUTED}/>
          {window.RR_instaFmt(b.format, lang)}
        </span>
        <span style={{opacity:.4}}>·</span>
        <span style={{display:'inline-flex', alignItems:'center', gap:5}}>
          <window.RR_Flag lang={b.lang} size={10}/>{b.lang==='pl'?'PL':'EN'}
        </span>
      </div>
      <div style={{width:'100%', display:'flex', alignItems:'center', gap:9}}>
        <div style={{flex:1, height:3, background:'rgba(255,255,255,.10)', borderRadius:99, overflow:'hidden'}}>
          <div style={{height:'100%', width:`${b.progress}%`, background:I_INK, opacity:.9, borderRadius:99}}/>
        </div>
        <span style={{fontFamily:I_MONO, fontSize:12, fontWeight:500, color:I_INK, fontVariantNumeric:'tabular-nums'}}>{b.progress}%</span>
      </div>
    </div>
  );

  return (
    <div style={{width:'100%', height:'100%', background:I_BG, color:I_INK, fontFamily:I_SANS,
      display:'flex', flexDirection:'column', boxSizing:'border-box',
      paddingTop:'calc(env(safe-area-inset-top, 0px) + 36px)',
      paddingBottom:'calc(env(safe-area-inset-bottom, 0px) + 40px)',
      paddingLeft:'calc(env(safe-area-inset-left, 0px) + 46px)',
      paddingRight:'calc(env(safe-area-inset-right, 0px) + 46px)',
      backgroundImage:'radial-gradient(120% 80% at 50% -10%, rgba(167,139,250,.10), transparent 55%)'}}>
      {/* Kicker */}
      <div style={{textAlign:'center', flexShrink:0}}>
        <div style={{fontFamily:I_MONO, fontSize:11, letterSpacing:'.28em', textTransform:'uppercase',
          color:I_MUTED}}>radekreads.pl</div>
        <h1 style={{margin:'12px 0 0', fontFamily:I_SANS, fontWeight:700, fontSize:30, letterSpacing:'-.03em'}}>
          {lang==='pl' ? 'Teraz czytam' : 'Reading now'}
        </h1>
        <div style={{width:34, height:2, background:I_LINE, margin:'18px auto 0'}}/>
      </div>

      {/* Centered covers */}
      <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', minHeight:0, overflow:'hidden'}}>
        <div style={{display:'grid', gridTemplateColumns:`repeat(${cols}, auto)`,
          gap: n>=3 ? '26px 30px' : 34, justifyContent:'center', alignItems:'start'}}>
          {books.map(b => (
            <div key={b.id} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:16}}>
              <div style={{position:'relative', display:'flex'}}>
                <div style={{position:'absolute', inset:'-38%', borderRadius:'50%',
                  background:`radial-gradient(farthest-side, ${window.RR_instaGenreGlow(b.genre,0.8)}, ${window.RR_instaGenreGlow(b.genre,0.35)} 55%, transparent 78%)`,
                  filter:'blur(22px)', pointerEvents:'none', zIndex:0}}/>
                <div style={{position:'relative', zIndex:1}}>
                  <window.RR_Cover book={b} w={Math.round(coverH*0.69)} h={coverH} radius={7}/>
                </div>
              </div>
              <Meta b={b}/>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
