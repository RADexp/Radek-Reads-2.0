// /insta — final page. Renders Design 1 ("Czysty") full-viewport so it fills
// the device screen edge-to-edge (tuned for iPhone 15 Pro: 393×852pt, 19.5:9,
// with safe-area insets for the Dynamic Island and home indicator). Tweaks
// control how many "teraz czytam" books show (1–4) and the language.

function InstaShell() {
  const [tweaks, setTweak] = window.useTweaks(/*EDITMODE-BEGIN*/{
    "count": 3,
    "lang": "pl"
  }/*EDITMODE-END*/);

  const count = tweaks.count;
  const lang  = tweaks.lang;
  const books = window.RR_instaReading(count);

  return (
    <>
      <div style={{ width:'100%', height:'100%' }}>
        <window.RR_InstaD1 books={books} lang={lang}/>
      </div>

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Zawartość">
          <window.TweakRadio
            label="Liczba książek"
            value={count}
            onChange={v => setTweak('count', v)}
            options={[
              {value:1, label:'1'},
              {value:2, label:'2'},
              {value:3, label:'3'},
              {value:4, label:'4'},
            ]}
          />
          <window.TweakRadio
            label="Język"
            value={lang}
            onChange={v => setTweak('lang', v)}
            options={[{value:'pl', label:'PL'}, {value:'en', label:'EN'}]}
          />
        </window.TweakSection>
      </window.TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<InstaShell/>);
