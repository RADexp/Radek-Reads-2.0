# Handoff: Radek Reads → Claude Code

Paczka do przekazania osobie/agentowi, który zaimplementuje **Radek Reads** w prawdziwym repo (Astro).

## Jak tego użyć (najkrótsza droga)

1. Stwórz nowe, puste repo dla projektu.
2. Wrzuć do niego ten cały folder `design_handoff_radek_reads/` (np. jako `/design`).
3. W Claude Code jako **pierwszą wiadomość** wklej całość z `Prompt - Claude Code.md` — to jest pełna specyfikacja (stack, model danych, strony, przepływ danych, Vercel/Notion, wymagania niefunkcjonalne, tryb pracy).
4. Dodaj jedno zdanie na końcu: *„Referencje wizualne i działające prototypy są w folderze `/design` — otwórz pliki `.html` i `.jsx`, traktuj je jako źródło prawdy dla wyglądu i zachowania UI. Screeny są w `/design/screenshots`."*

Claude Code czyta źródło HTML/JSX bezpośrednio — to jest najdokładniejsza referencja. Screeny są dla szybkiego podglądu bez uruchamiania.

## Co jest w środku

```
design_handoff_radek_reads/
├─ README.md                  ← ten plik
├─ Prompt - Claude Code.md    ← PEŁNA specyfikacja — to wklejasz do Claude Code
├─ designs/                   ← działające prototypy (referencja wizualna)
│  ├─ Radek Reads Redesign.html        — strona główna / półka
│  ├─ Radek Reads - Strona recenzji.html — strona recenzji (Design 1 · Dossier + 2 alternatywy)
│  ├─ Radek Reads - Insta.html          — ekran /insta (Stories)
│  ├─ Astro - Przepływ danych.html      — diagram build-time data flow
│  ├─ data/                              — przykładowe dane (books.js, review-acotar.js)
│  └─ variants/, *.jsx                   — komponenty React prototypów
└─ screenshots/
   ├─ 01-home-shelf.png
   ├─ 02-review-page.png
   ├─ 04-insta.png
   └─ 05-data-flow.png
```

## Ważne — czym te pliki SĄ, a czym NIE

Pliki w `designs/` to **referencje wizualne stworzone w HTML/React** — prototypy pokazujące docelowy wygląd i zachowanie. **To nie jest kod produkcyjny do skopiowania.** Zadaniem jest **odtworzyć te designy w docelowym stacku (Astro + czysty CSS / scoped `<style>`)** zgodnie z zasadami z `Prompt - Claude Code.md`, a nie przeklejać React/Babel.

Prototypy używają React + Babel tylko po to, żeby dało się je obejrzeć w przeglądarce — w produkcji ma być statyczny HTML z minimalnym JS (patrz wymagania w prompcie).

## Fidelity: **hi-fi**

Kolory, typografia, spacing i interakcje są dopracowane — odtwarzaj UI pixel-perfect (na bazie HTML/CSS z prototypów), tłumacząc tylko technologię na Astro + scoped CSS.

## Strony / widoki (mapa na prompt)

- **Półka / strona główna** → `designs/Radek Reads Redesign.html` · screen `01`. Sekcje: Teraz czytam (pasek postępu) / Następne / Przeczytane (gwiazdki), karty książek, chipy gatunków, filtry.
- **Strona recenzji** → `designs/Radek Reads - Strona recenzji.html` · screen `02`. Kierunek **Design 1 · Dossier**: sticky „teczka" po lewej + długa recenzja po prawej; mobile składa do jednej kolumny. Plik zawiera 3 warianty na płótnie — docelowy jest **Design 1**.
- **/insta** → `designs/Radek Reads - Insta.html` · screen `04`. Pełnoekranowy 393×852, safe-area, „Teraz czytam".
- **Przepływ danych** → `designs/Astro - Przepływ danych.html` · screen `05`. Diagram build-time fetch z Notion → statyczny HTML na Vercel.

## Otwieranie prototypów lokalnie

Pliki `.html` ładują React/Babel z CDN i komponenty `.jsx` przez `fetch`, więc **uruchom je przez lokalny serwer**, nie `file://`:

```
cd design_handoff_radek_reads/designs
python3 -m http.server 8000
# → http://localhost:8000/
```

(Otwarcie podwójnym klikiem może nie zadziałać przez CORS na `file://` — wtedy wystarczą screeny.)

## Estetyka (skrót — szczegóły w prompcie)

Ciemne tło (granat ~`#0B0820` / `#0f0c20`), fiolet jako akcent, nagłówki „Space Grotesk", mono „Space Mono" do meta/etykiet, oceny gwiazdkami, chipy gatunków z kolorowym odcieniem. Literacko, elegancko, bez AI-slopu.
