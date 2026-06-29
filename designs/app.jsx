// Top-level shell that wires the Tweaks panel into the canvas.
// Each variant reads RR_Context for langOverride. Accent is applied as a
// CSS variable (--rr-accent / --rr-accent-2) so variants that opt in pick
// it up live. Show-stars / show-flags toggles drive data-attrs on <html>.

window.RR_Context = React.createContext({ langOverride: null });

const ACCENT_OPTIONS = [
  ['#5B4BD4', '#A78BFA'], // Violet — current direction, refreshed
  ['#6D2C8F', '#C77DFF'], // Plum
  ['#3056D3', '#7DA4FF'], // Midnight
  ['#D04A6B', '#FF8A8A'], // Sunset
];

function RRShell() {
  const [tweaks, setTweak] = window.useTweaks(/*EDITMODE-BEGIN*/{
    "lang": "auto",
    "accent": ["#5B4BD4", "#A78BFA"],
    "showStars": true,
    "showFlags": true
  }/*EDITMODE-END*/);

  React.useEffect(() => {
    const [a, a2] = tweaks.accent || ACCENT_OPTIONS[0];
    document.documentElement.style.setProperty('--rr-accent', a);
    document.documentElement.style.setProperty('--rr-accent-2', a2);
  }, [tweaks.accent]);

  React.useEffect(() => {
    document.documentElement.dataset.rrStars = tweaks.showStars ? '1' : '0';
    document.documentElement.dataset.rrFlags = tweaks.showFlags ? '1' : '0';
  }, [tweaks.showStars, tweaks.showFlags]);

  const ctx = {
    langOverride: tweaks.lang === 'auto' ? null : tweaks.lang,
  };

  const lang = ctx.langOverride || 'pl';

  return (
    <window.RR_Context.Provider value={ctx}>
      <window.DesignCanvas
        title="Radek Reads — Redesign"
        subtitle="Wariant C · mobile-first · klikalne (search, filtry, PL/EN). Kliknij artboard, żeby otworzyć fullscreen."
      >
        <window.DCSection id="intro" title="Założenia + system"
          subtitle="Co priorytetyzujemy: 'teraz czytam' na samej górze, gatunek + język od razu widoczne, gęsta lista przeczytanych z filtrami i wyszukiwarką. Spójność mobile ↔ desktop.">
          <window.DCArtboard id="brief" label="Założenia" width={520} height={620}>
            <window.RRBrief lang={lang}/>
          </window.DCArtboard>
          <window.DCArtboard id="system" label="System wspólny" width={520} height={620}>
            <window.RRSystem lang={lang}/>
          </window.DCArtboard>
        </window.DCSection>

        <window.DCSection id="variant-c" title="Wariant C · Bold, dark, genre-coded"
          subtitle="Tryb ciemny jako podstawa, każda książka ma kolor swojego gatunku w tle — gatunek czytasz wzrokiem nim przeczytasz tytuł. Bento na 'teraz czytam'. Najbardziej odważny wizualnie.">
          <window.DCArtboard id="c-mobile" label="Mobile · 390" width={390} height={2100}>
            <window.RR_VariantC_Mobile/>
          </window.DCArtboard>
          <window.DCArtboard id="c-desktop" label="Desktop · 1280" width={1280} height={2000}>
            <window.RR_VariantC_Desktop/>
          </window.DCArtboard>
        </window.DCSection>
      </window.DesignCanvas>

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Globalne">
          <window.TweakRadio
            label="Język"
            value={tweaks.lang}
            onChange={v => setTweak('lang', v)}
            options={[
              {value:'auto', label:'Auto'},
              {value:'pl',   label:'PL'},
              {value:'en',   label:'EN'},
            ]}
          />
        </window.TweakSection>

        <window.TweakSection label="Gęstość informacji">
          <window.TweakToggle
            label="Gwiazdki (oceny)"
            value={tweaks.showStars}
            onChange={v => setTweak('showStars', v)}
          />
          <window.TweakToggle
            label="Flagi językowe"
            value={tweaks.showFlags}
            onChange={v => setTweak('showFlags', v)}
          />
        </window.TweakSection>
      </window.TweaksPanel>
    </window.RR_Context.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<RRShell/>);
