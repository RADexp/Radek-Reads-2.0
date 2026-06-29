# Radek Reads v2 — prompt startowy dla Claude Code

> Skopiuj całość poniżej (od "## Kontekst i cel") do Claude Code jako pierwszą wiadomość w nowym, pustym repo.

---

## Kontekst i cel

Zbuduj **Radek Reads** — osobistą stronę z recenzjami książek, wersję 2.0 dotychczasowego serwisu "Radek Czyta" (radekreads.pl). To projekt hobbystyczny, niski ruch, ale **priorytetem jest szybkość ładowania, zwłaszcza na mobile**.

**Wersja 1 (obecna, działająca)**: statyczna strona HTML/JS/CSS bez build systemu, hostowana na GitHub Pages. Dane o książkach pochodziły z publicznego Google Sheet (eksport CSV), pobieranego po stronie klienta przy każdym wejściu na stronę. Treści recenzji generowane były jako statyczne pliki HTML z plików Markdown lub z kolumny w arkuszu.

**Wersja 2 (do zbudowania w tej rozmowie)**: dane przeniesione do **Notion** (zaciągane przez Notion API), zupełnie nowy frontend. Stack jest już zdecydowany — **nie proponuj alternatyw**, trzymaj się tego:

- **Astro** (SSG, output statyczny) — generuje czysty HTML, domyślnie 0 KB JS.
- **Źródło treści: Notion** — dane o książkach pobierane **przy buildzie** (build-time fetch), nigdy z przeglądarki.
- **Hosting: Vercel** (darmowy plan hobby), **rebuild wyzwalany webhookiem z Notion**.
- **Styl: czysty CSS / scoped `<style>` w plikach `.astro`** — bez Tailwinda, bez bibliotek UI.
- **Interfejs dwujęzyczny PL/EN** z przełącznikiem.

Zasada nadrzędna: jak najmniej JavaScriptu w runtime. Interaktywność (przełącznik języka, filtrowanie) tylko jako **wyspy Astro** (`client:*`), i tylko tam, gdzie naprawdę trzeba — najlepiej w ogóle bez JS, na CSS-ie i linkach.

Cel tego promptu: przenieść 1:1 logikę biznesową obecnego serwisu (reguły, model danych, transformacje), żeby nic z dotychczasowego zachowania się nie zgubiło, w nowej architekturze. Warstwa wizualna ma być zaprojektowana od nowa — nie kopiuj starego UI, kopiuj logikę.

---

## KROK 0 — najpierw zweryfikuj dane (zanim cokolwiek zbudujesz)

Baza w Notion **już istnieje** (jest transferem z Google Sheets, więc nazwy/typy pól mogą być nieoczywiste).

Zanim zaczniesz kodować UI:

1. Połącz się z Notion API (integration token z `.env`, patrz niżej).
2. Pobierz schemat bazy (`databases.retrieve`) i **wypisz wszystkie właściwości: nazwa pola + typ Notion** (title, rich_text, select, multi_select, number, files, url, checkbox, status itd.).
3. Pobierz 2–3 przykładowe wiersze i pokaż surowe wartości.
4. **Zatrzymaj się i pokaż mi mapowanie** pól Notion → poniższy model danych. Wskaż pola, których brakuje, są nazwane inaczej albo mają inny typ niż zakładam. **Poczekaj na moje potwierdzenie**, zanim przejdziesz dalej. Nie zgaduj po cichu.
5. **Zapytaj mnie konkretnie o pochodzenie slug-a** (`id` w modelu niżej, używany w `/recenzje/[slug]`): czy ma być generowany algorytmicznie z tytułu+autora (normalizacja, lowercase, myślniki — jak w v1), czy chcę go wpisywać ręcznie jako property w Notion. Nie zakładaj domyślnie ani jednego, ani drugiego.

---

## Model danych (docelowy kształt po stronie aplikacji)

Każda książka powinna po zmapowaniu wyglądać mniej więcej tak. Dopasuj nazwy do realnej bazy w kroku 0.

```ts
type Shelf = 'reading' | 'next' | 'finished';   // teraz czytam / następne / przeczytane
type Format = 'paper' | 'ebook' | 'audiobook';
type Lang = 'pl' | 'en';

interface Book {
  id: string;            // stabilny slug do URL-a, np. 'dune-frank-herbert' — pochodzenie do ustalenia w KROKU 0
  shelf: Shelf;
  title: string;
  author: string;
  genre: string;         // wolna wartość z realnej listy select w Notion (patrz "Gatunki" niżej) — NIE zamknięta paleta z góry
  lang: Lang;            // język egzemplarza, który czytał Radek — tylko PL/EN
  format: Format;
  cover?: string;        // URL zewnętrzny (lubimyczytac.pl / amazon.com itp.) — patrz sekcja o okładkach
  color?: string;        // kolor zastępczy, gdy brak okładki

  // tylko 'reading':
  progress?: number;     // 0–100, parse int, clamp 0–100, brak/niepoprawne → undefined (nie renderuj badge'a)

  // tylko 'finished':
  rating?: number;       // 0–5, KROK 0.25 (np. 3.75). Zaokrąglenie: Math.round(value * 4) / 4, clamp 0–5.
                          // 0 = brak oceny → nie wyświetlaj gwiazdek.

  // pełna recenzja — JEDEN blok wolnej treści strony Notion (blocks), nie kilka osobnych pól:
  review?: string;       // markdown/blocks renderowane do HTML — patrz "Logika recenzji" niżej

  // linki zakupowe — pokazywane OBA naraz, gdy istnieją (bez logiki "preferowanego" linku):
  buyLinks?: { pl?: string; en?: string };
}
```

**Gatunki**: NIE definiuj zamkniętej, z góry ustalonej palety. Użyj realnych wartości już istniejących w kolumnie "Gatunek" w bazie Notion (np. Science Fiction, Psychologiczna, Biznesowa, Popularnonaukowa, Non-fiction, Self development, Sportowa — zobacz dokładną listę w KROKU 0) i traktuj ją jako rozszerzalną. Każdej wartości przypisz własny odcień (hue) do chipa — możesz to zrobić dynamicznie (hash nazwy → hue) albo mapą, którą rozszerzysz, gdy pojawi się nowy gatunek w Notion.

**Dwujęzyczność:** UI ma przełącznik PL/EN (etykiety, nagłówki sekcji itd. tłumaczone w słowniku w kodzie). Treść recenzji jest pisana ręcznie po polsku — nie tłumacz jej automatycznie; przełącznik dotyczy interfejsu, nie treści książek. Zachowaj jako wymaganie funkcjonalne: zapamiętywanie wyboru języka po stronie klienta (localStorage) między wizytami, z wykrywaniem domyślnego języka przeglądarki jako fallback, gdy użytkownik nie ustawił preferencji. Zaproponuj konkretne podejście (np. dwie ścieżki językowe vs lekka wyspa JS) w kroku planowania — preferuj rozwiązanie statyczne, bez przeładowania całej aplikacji.

---

## Logika bucketowania statusu (3 sekcje, bez keyword-matchingu)

W v1 status był wolnym tekstem dopasowywanym po słowach kluczowych (np. "czytam"/"reading"→reading). W v2 status jest **z góry zdefiniowanym Select w Notion** z 3 wartościami odpowiadającymi `Shelf`, więc żadne dopasowywanie tekstu nie jest potrzebne — wystarczy bezpośrednie mapowanie wartości Select na sekcję.

Zachowaj jednak fakt, że muszą istnieć dokładnie te 3 sekcje na stronie głównej, i że książka z nieprawidłowym/pustym statusem powinna być pomijana (lub trafiać do osobnej kategorii "bez statusu" — do decyzji w trakcie planowania).

## Logika recenzji

Recenzja to **natywna treść strony książki w Notion** (rich text / blocks), pobierana przez API jako jeden blok treści — nie jako kilka osobnych property. Sekcje wizualne typu "O książce / Dla kogo / Nie dla kogo / Moja opinia" (jeśli zdecydujemy się je zachować w layoucie strony recenzji) są strukturą **wewnątrz** tego jednego blogu treści (np. wyznaczaną nagłówkami h2), nie odrębnymi polami w Notion.

**Do zachowania (renderowanie treści):**
- Nagłówki (h1–h6), listy nieuporządkowane, pogrubienie, kursywa, kod inline, linki (`target="_blank" rel="noopener noreferrer"`, walidacja URL: tylko `http:`/`https:` przez `new URL()`).
- **Wykrywanie linku YouTube w treści recenzji** i automatyczne zamienianie go na responsywny embed (obsługa formatów `youtu.be/{id}`, `youtube.com/watch?v={id}`, `/embed/{id}`, `/shorts/{id}`), z usunięciem surowego linku z tekstu. Sprawdź w KROKU 0, czy lepiej wykrywać link w tekście, czy używać natywnego bloku video Notion (jeśli tak wstawiam wideo).
- Notion API zwraca już ustrukturyzowane blocks (heading, bulleted_list_item, paragraph itd.) — renderowanie może być prostsze niż markdown-to-HTML z v1, bo Notion już sparsował te elementy. Zachować trzeba tylko logikę wykrywania YouTube.

**Recenzja widoczna jest tylko dla książek ze statusem `finished` i tylko jeśli treść recenzji istnieje** (niepusta). Strona recenzji musi obsłużyć 3 stany w zależności od danych: pełna recenzja / tylko ocena (bez długiego tekstu) / "teraz czytam" (postęp zamiast oceny, dla `reading`).

## Reguły pomocnicze do zachowania 1:1

- **Slugify** (jeśli decyzja z KROKU 0 to generowanie algorytmiczne): normalizacja Unicode (NFD, usunięcie znaków diakrytycznych), lowercase, zamiana znaków niealfanumerycznych na myślniki, redukcja wielokrotnych myślników, przycięcie krawędzi.
- **Walidacja i sanityzacja linków zewnętrznych**: tylko `http:`/`https:`, odrzucenie pozostałych protokołów, zwrot znormalizowanego href albo `null`/pominięcie.
- **Linki zakupowe**: pokaż **oba** (`buyLinks.pl` i `buyLinks.en`), gdy istnieją, obok siebie w "teczce" książki — bez logiki wybierania jednego "preferowanego" linku wg języka.
- **Ocena**: zaokrąglenie do najbliższej 0.25, clamp 0–5, wartość 0 = brak oceny (nie renderuj gwiazdek).
- **Progres czytania**: parse int, clamp 0–100, brak/niepoprawna wartość → nie renderuj badge'a. Tylko dla `reading`.
- **Ikony formatu**: `audiobook` → 🎧, `ebook` → 📱, `paper` → 📕.
- Brak potrzeby flag językowych dla 5 języków (ES/DE/FR) — zakres zwężony do PL/EN, prosta etykieta/flaga 🇵🇱/🇬🇧 wystarczy.

## Obsługa błędów i fallbacków

- Błąd pobierania danych z Notion API (sieć/HTTP) → komunikat błędu (to dzieje się na etapie builda, więc traktuj to jako błąd builda, nie runtime UI state).
- Pusta baza Notion (brak książek) → komunikat "brak danych" w sekcji.
- Książka bez okładki → karta z kolorem zastępczym (`color`) zamiast obrazka.
- Książka bez oceny/linku/progresu/recenzji → po prostu nie renderuj danego elementu (nie pokazuj "0" czy myślnika).

---

## Strony do zbudowania

1. **Strona główna = półka** (`/`)
   - Trzy sekcje: **Teraz czytam** (z paskiem postępu), **Następne**, **Przeczytane** (z oceną gwiazdkami).
   - Karty książek: okładka/kolor, tytuł, autor, chip gatunku, format. Klik → strona recenzji.
   - Lekkie filtrowanie po gatunku / ocenie / formacie **bez JS jeśli się da** (CSS `:has`, `<details>`, linki z query) — a jeśli musi być JS, to wyspa `client:visible`.

2. **Strona pojedynczej recenzji** (`/recenzje/[slug]`)
   - Generowana statycznie przez `getStaticPaths()` — jeden plik HTML na książkę.
   - **Kierunek wizualny: „Design 1 · Dossier"** — układ dwukolumnowy: po lewej **sticky „teczka"** książki (okładka, meta: autor/gatunek/format, ocena, oba linki zakupowe PL/EN), po prawej długa recenzja w wygodnej szerokości czytania.
   - Stany strony: pełna recenzja / tylko ocena (bez długiego tekstu) / „teraz czytam" (postęp zamiast oceny). Obsłuż wszystkie trzy w zależności od danych.
   - Na mobile kolumny składają się do jednej (teczka u góry, recenzja pod nią).

3. **Strona „O mnie / o blogu"** (`/o-mnie`)
   - Statyczna treść (na razie placeholder, oznacz wyraźnie do uzupełnienia). Dwujęzyczna.

4. **`/insta`** — ekran „na telefon" do udostępniania na Instagram Stories
   - Pełnoekranowy (`100dvh`), edge-to-edge, dostrojony pod iPhone (np. 393×852, 19.5:9), z `viewport-fit=cover` i obsługą safe-area (Dynamic Island, home indicator).
   - Pokazuje aktualne „Teraz czytam" (1–4 pozycje, domyślnie 3) w czystym, oddychającym layoucie. Język PL/EN.
   - To strona-grafika, nie typowa podstrona — ma ładnie wyglądać na screenshocie.

5. **RSS / newsletter**
   - Endpoint **RSS** (`/rss.xml`) generowany przy buildzie z przeczytanych książek + recenzji (użyj `@astrojs/rss`).
   - „Newsletter": na razie tylko miejsce na formularz zapisu (placeholder na zewnętrzną usługę typu Buttondown/Mailchimp — nie implementuj backendu maili, zostaw wyraźny TODO i punkt podpięcia).

### TODO v1.1 (poza zakresem pierwszej wersji — nie implementuj teraz, tylko zostaw miejsce)

- **`series`** — seria książki (np. "Bobiverse #1") jako opcjonalne pole na karcie/teczce. Wymaga dodania nowego property w Notion (nie istnieje jeszcze w bazie).
- **`tldr`** — jednozdaniowe podsumowanie książki, np. do wyświetlenia na karcie listy. Wymaga dodania nowego property w Notion (do potwierdzenia z użytkownikiem przy realizacji v1.1, czy nadal potrzebne).

---

## Architektura przepływu danych (build-time)

```
Notion (baza książek, token sekretny)
        │  fetch przy `astro build` (na serwerze Vercel)
        ▼
src/lib/notion.ts  ── pobiera + mapuje wiersze → Book[]
        │            (token z process.env, NIGDY do klienta)
        ▼
strony .astro  ── getStaticPaths() renderuje statyczny HTML
        │          (okładki: zewnętrzne URL-e renderowane wprost w <img>)
        ▼
dist/  ── czysty HTML/CSS/obrazy → Vercel CDN
        ▼
Użytkownik (mobile)  ── gotowy HTML, 0 zapytań do Notion w runtime
```

Wymagania implementacyjne:

- `src/lib/notion.ts`: jedna funkcja `getBooks(): Promise<Book[]>` używana przez strony. Token czytany z `import.meta.env.NOTION_TOKEN`. Obsłuż **paginację** Notion (`has_more` / `start_cursor`) — baza może urosnąć ponad 100 wierszy.
- **Okładki to zewnętrzne URL-e** zapisane w polu Notion (typowo prowadzą do obrazków na `lubimyczytac.pl` lub `amazon.com`). To pole typu `url`, nie plik — **nie wgrywaj okładek jako pliki do Notion** (linki do plików wgranych przez Notion wygasają po ~1h, niewłaściwe dla statycznego builda).
- Wyświetlaj okładki z tych URL-i bezpośrednio w `<img>` — z `width`/`height` (zapobiega CLS), `loading="lazy"`, `decoding="async"` i sensownym `alt`. Dodaj `referrerpolicy="no-referrer"` (część hostingów blokuje hotlinking po nagłówku Referer) oraz fallback na kolor zastępczy, gdy obrazek się nie załaduje lub URL jest pusty.
- **Nie** przepuszczaj tych URL-i przez `astro:assets` na tym etapie — `<Image />` próbowałby pobierać i optymalizować zdalne obrazy przy buildzie, co jest kruche dla obcych domen. Zostaw wyraźny **TODO**: docelowo można pobierać okładki do repo / optymalizować, gdy zdecydujemy się hostować je u siebie.
- W `astro.config` dodaj komentarz, że jeśli kiedyś przejdziemy na `astro:assets` dla zdalnych obrazów, trzeba dopisać domeny do `image.domains` / `image.remotePatterns`.
- Astro config: `output: 'static'`, adapter Vercel (`@astrojs/vercel`).

---

## Konfiguracja Vercel + webhook

- Dodaj `.env.example` z `NOTION_TOKEN=` i `NOTION_DATABASE_ID=`. Prawdziwe wartości wchodzą w panel Vercel jako Environment Variables (i moje lokalne `.env`, które jest w `.gitignore`).
- W README opisz krok po kroku:
  1. utworzenie integracji Notion i udostępnienie jej bazy,
  2. wrzucenie zmiennych do Vercel,
  3. utworzenie **Deploy Hooka** w Vercel,
  4. podpięcie tego hooka jako **automatyzacji w Notion** (lub przez Make/Zapier, jeśli Notion natywnie nie wyśle webhooka po edycji) tak, żeby zmiana w bazie wyzwalała rebuild.
- Zaznacz wyraźnie, że treść odświeża się dopiero po rebuildzie (to świadomy kompromis SSG na rzecz wydajności).

---

## Wymagania niefunkcjonalne (twarde)

- **Wydajność mobile to priorytet #1.** Cel: Lighthouse Performance ~100 na mobile, znikomy JS. Żadnych ciężkich bibliotek. Fonty `font-display: swap`, `preconnect`, najlepiej tylko potrzebne wagi.
- **Dostępność:** semantyczny HTML, kontrast, focus states, `alt` na okładkach, nawigacja klawiaturą, `prefers-reduced-motion` respektowane.
- **SEO:** poprawne `<title>`/meta na każdej stronie, Open Graph (okładka jako obrazek OG dla recenzji), `sitemap` (`@astrojs/sitemap`), `lang` na `<html>`.
- **Dwujęzyczność:** przełącznik PL/EN nie powinien wymagać przeładowania całej aplikacji ani ciężkiego JS — preferuj rozwiązanie statyczne (np. dwie ścieżki językowe albo lekka wyspa). Zaproponuj podejście w kroku planowania.
- Czysty, czytelny CSS: zmienne CSS na kolory/spacing/typografię, scoped style w komponentach `.astro`.

---

## Estetyka (punkt wyjścia, nie sztywny wymóg)

Dotychczasowy kierunek: ciemne tło (granat ~`#0B0820`), fiolet jako akcent, font nagłówkowy „Space Grotesk", mono „Space Mono" do meta/etykiet. Oceny jako gwiazdki, chipy gatunków z kolorowym odcieniem. Spokojnie, „literacko", bez AI-slopu (bez nadmiaru gradientów, bez emoji, bez kart z zaokrąglonym lewym akcentem). Możesz to dopracować, ale trzymaj ciemny, elegancki, czytelny ton.

---

## Tryb pracy

1. Wykonaj **KROK 0** (weryfikacja schematu Notion, w tym pochodzenie slug-a) i poczekaj na moje potwierdzenie mapowania.
2. Przedstaw **krótki plan**: struktura folderów, lista route'ów, podejście do i18n i do okładek. Poczekaj na akceptację.
3. Dopiero potem implementuj — najpierw `src/lib/notion.ts` + typy, potem półka, potem strona recenzji, potem reszta.
4. Pisz przyrostowo i pokazuj postęp. Nie dorzucaj funkcji, o które nie prosiłem (w tym `series`/`tldr` z TODO v1.1) — jeśli masz pomysł, zaproponuj go, nie dodawaj sam.
