// Brief + System overview cards for the intro section of the canvas.

window.RRBrief = function RRBrief({ lang='pl' }) {
  return (
    <div style={{
      width:'100%', height:'100%', background:'#F4F2FE', padding:32,
      fontFamily:'Inter, system-ui, sans-serif', color:'#1E1B3A',
      display:'flex', flexDirection:'column', gap:18, overflow:'auto', boxSizing:'border-box',
    }}>
      <div>
        <div style={{fontSize:11, letterSpacing:'.18em', textTransform:'uppercase', color:'#7A7AA0', fontWeight:600}}>
          Redesign · Założenia
        </div>
        <h2 style={{margin:'4px 0 0', fontSize:28, fontWeight:800, letterSpacing:'-.02em'}}>
          Co naprawiamy
        </h2>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'auto 1fr', columnGap:14, rowGap:12, fontSize:13.5, lineHeight:1.4}}>
        <BulletNum n="1"/><div>
          <b>Architektura informacji:</b> <i>„teraz czytam"</i> na pierwszym ekranie, kolejka i archiwum poniżej — bez chowania pod scrollem.
        </div>
        <BulletNum n="2"/><div>
          <b>Gatunek + język = informacja pierwszego rzutu oka.</b> Każda karta nosi chip gatunku i flagę języka, bez wczytywania okładki.
        </div>
        <BulletNum n="3"/><div>
          <b>Filtry + search</b> po gatunku, języku, formacie, ocenie. Działają bez przeładowania.
        </div>
        <BulletNum n="4"/><div>
          <b>Mobile-first.</b> Karuzele swipe, paski filtrów scrollowane poziomo, gęstość ≥ desktop'owej.
        </div>
        <BulletNum n="5"/><div>
          <b>Spójność mobile ↔ desktop.</b> Te same komponenty, tylko inny layout (1-kol → 6-kol).
        </div>
      </div>

      <div style={{
        marginTop:'auto', padding:14, borderRadius:12,
        background:'#fff', border:'1px solid rgba(91,75,212,.12)', fontSize:12.5, color:'#3A3560',
      }}>
        <b>Czego nie ruszam:</b> fioletowy ton, prostota, auto-sync z Google Sheets, toggle PL/EN.
      </div>
    </div>
  );
};

function BulletNum({ n }) {
  return (
    <div style={{
      width:24, height:24, borderRadius:6, background:'#5B4BD4', color:'#fff',
      display:'grid', placeItems:'center', fontWeight:700, fontSize:12, flexShrink:0, marginTop:1,
    }}>{n}</div>
  );
}

window.RRSystem = function RRSystem({ lang='pl' }) {
  const genres = window.RR_GENRES;
  return (
    <div style={{
      width:'100%', height:'100%', background:'#fff', padding:32,
      fontFamily:'Inter, system-ui, sans-serif', color:'#1E1B3A',
      display:'flex', flexDirection:'column', gap:20, overflow:'auto', boxSizing:'border-box',
    }}>
      <div>
        <div style={{fontSize:11, letterSpacing:'.18em', textTransform:'uppercase', color:'#7A7AA0', fontWeight:600}}>
          System · Wspólne wzorce
        </div>
        <h2 style={{margin:'4px 0 0', fontSize:28, fontWeight:800, letterSpacing:'-.02em'}}>
          Co używamy wszędzie
        </h2>
      </div>

      <div>
        <SysRow label="Gatunki (8)">
          <div style={{display:'flex', flexWrap:'wrap', gap:6}}>
            {Object.entries(genres).map(([k, g]) => (
              <span key={k} style={{
                fontSize:11, fontWeight:600, padding:'4px 9px', borderRadius:999,
                background:`oklch(0.96 0.04 ${g.hue})`, color:`oklch(0.42 0.16 ${g.hue})`,
              }}>{g.pl}</span>
            ))}
          </div>
        </SysRow>

        <SysRow label="Format">
          <div style={{display:'flex', gap:14, fontSize:12, alignItems:'center'}}>
            <FmtIcon format="audiobook" label="Audio"/>
            <FmtIcon format="ebook" label="Ebook"/>
            <FmtIcon format="paper" label="Papier"/>
          </div>
        </SysRow>

        <SysRow label="Język">
          <div style={{display:'flex', gap:14, fontSize:12, alignItems:'center'}}>
            <span style={{display:'inline-flex', gap:6, alignItems:'center'}}><window.RR_Flag lang="pl" size={12}/> PL</span>
            <span style={{display:'inline-flex', gap:6, alignItems:'center'}}><window.RR_Flag lang="en" size={12}/> EN</span>
          </div>
        </SysRow>

        <SysRow label="Ocena">
          <window.RR_StarRow value={4} size={16} color="#5B4BD4" muted="rgba(91,75,212,.18)"/>
        </SysRow>

        <SysRow label="Pasek postępu">
          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <div style={{flex:1, height:6, background:'rgba(91,75,212,.10)', borderRadius:99, overflow:'hidden'}}>
              <div style={{height:'100%', width:'40%', background:'#5B4BD4'}}/>
            </div>
            <span style={{fontSize:11, fontWeight:700, color:'#5B4BD4'}}>40%</span>
          </div>
        </SysRow>
      </div>

      <div style={{marginTop:'auto', padding:14, borderRadius:12, background:'#F4F2FE',
        fontSize:12, color:'#3A3560', lineHeight:1.45}}>
        Każdy wariant używa tych samych prymitywów. Różni się typografią, tłem i podejściem do układu.
        Klik na książkę → strona szczegółowa (z opinią, oceną, długim review — patrz Wariant ACOTAR w PDF-ie).
      </div>
    </div>
  );
};

function SysRow({ label, children }) {
  return (
    <div style={{display:'grid', gridTemplateColumns:'130px 1fr', alignItems:'center', gap:14,
      paddingBlock:12, borderBottom:'1px solid rgba(0,0,0,.06)'}}>
      <div style={{fontSize:11, letterSpacing:'.10em', textTransform:'uppercase', color:'#7A7AA0', fontWeight:600}}>{label}</div>
      <div>{children}</div>
    </div>
  );
}

function FmtIcon({ format, label }) {
  return (
    <span style={{display:'inline-flex', gap:6, alignItems:'center'}}>
      <window.RR_FormatIcon format={format} size={14} color="#1E1B3A"/>
      <span>{label}</span>
    </span>
  );
}
