// Book-detail page — shell. Presents three review-page designs (each in a
// mobile + desktop artboard) on the design canvas, plus a Tweaks panel that
// drives shared page state: interface language, page state (full review /
// rated-only / currently-reading) and which buy-links show (PL / EN / both).

function RRReviewShell() {
  const [t, setTweak] = window.useTweaks(/*EDITMODE-BEGIN*/{
    "lang": "pl",
    "state": "review",
    "links": "both"
  }/*EDITMODE-END*/);

  const lang  = t.lang;
  const state = t.state;
  const which = t.links;
  const shared = { lang, state, which };

  return (
    <>
      <window.DesignCanvas
        title="Radek Reads — Strona recenzji książki"
        subtitle="Trzy kierunki strony pojedynczej książki · każdy w wersji mobile + desktop. Te same dane co na półce + linki zakupowe PL/EN + długie pole recenzji (h2/h3). Przełączaj stan strony i język w panelu Tweaks (prawy dolny róg)."
      >
        <window.DCSection id="d1" title="Design 1 · Dossier"
          subtitle="Dwukolumnowy. Sticky „teczka” książki po lewej (okładka, meta, ocena, linki), długa recenzja po prawej w wygodnej szerokości czytania. Najbardziej klasyczny układ strony szczegółów.">
          <window.DCArtboard id="d1-mobile" label="Mobile · 390" width={390} height={2580}>
            <window.RR_ReviewD1 variant="mobile" {...shared}/>
          </window.DCArtboard>
          <window.DCArtboard id="d1-desktop" label="Desktop · 1280" width={1280} height={1480}>
            <window.RR_ReviewD1 variant="desktop" {...shared}/>
          </window.DCArtboard>
        </window.DCSection>

        <window.DCSection id="d2" title="Design 2 · Editorial"
          subtitle="Literacki, magazynowy. Pełnoszerokościowy hero z okładką i dużą oceną, recenzja w jednej wyśrodkowanej kolumnie złożonej szeryfem. Linki w szerokiej belce pod hero.">
          <window.DCArtboard id="d2-mobile" label="Mobile · 390" width={390} height={2920}>
            <window.RR_ReviewD2 variant="mobile" {...shared}/>
          </window.DCArtboard>
          <window.DCArtboard id="d2-desktop" label="Desktop · 1180" width={1180} height={2260}>
            <window.RR_ReviewD2 variant="desktop" {...shared}/>
          </window.DCArtboard>
        </window.DCSection>

        <window.DCSection id="d3" title="Design 3 · Verdict bento"
          subtitle="Skanowalny, kartowy. U góry bento: okładka, werdykt (duża ocena + jednozdaniowe podsumowanie), szybkie „dla kogo / nie dla”, linki. Recenzja niżej jako karty sekcji z paskiem gatunku.">
          <window.DCArtboard id="d3-mobile" label="Mobile · 390" width={390} height={2960}>
            <window.RR_ReviewD3 variant="mobile" {...shared}/>
          </window.DCArtboard>
          <window.DCArtboard id="d3-desktop" label="Desktop · 1280" width={1280} height={1760}>
            <window.RR_ReviewD3 variant="desktop" {...shared}/>
          </window.DCArtboard>
        </window.DCSection>
      </window.DesignCanvas>

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Podgląd">
          <window.TweakRadio
            label="Język"
            value={lang}
            onChange={v => setTweak('lang', v)}
            options={[{value:'pl', label:'PL'}, {value:'en', label:'EN'}]}
          />
          <window.TweakRadio
            label="Stan strony"
            value={state}
            onChange={v => setTweak('state', v)}
            options={[
              {value:'review',  label:'Recenzja'},
              {value:'rated',   label:'Ocena'},
              {value:'reading', label:'Czytam'},
            ]}
          />
        </window.TweakSection>

        <window.TweakSection label="Linki do książki">
          <window.TweakRadio
            label="Pokaż"
            value={which}
            onChange={v => setTweak('links', v)}
            options={[
              {value:'both', label:'Oba'},
              {value:'pl',   label:'PL'},
              {value:'en',   label:'EN'},
            ]}
          />
        </window.TweakSection>
      </window.TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<RRReviewShell/>);
