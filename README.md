# Radek Reads v2

Osobista strona z recenzjami książek. Astro (SSG) + dane z Notion pobierane przy buildzie + hosting na Vercel z rebuildem przez webhook.

## Stack

- **Astro** (`output: 'static'`) — zero JS w runtime poza pojedynczą małą wyspą przełącznika języka.
- **Notion** jako źródło danych (`@notionhq/client`), fetch wyłącznie przy buildzie (`src/lib/notion.ts`).
- **Vercel** (`@astrojs/vercel` adapter) + Deploy Hook wyzwalany z Notion przy zmianie w bazie.
- Czysty CSS (zmienne w `src/styles/global.css`), scoped `<style>` w komponentach `.astro`.

## Rozwój lokalny

```bash
npm install
cp .env.example .env   # uzupełnij NOTION_TOKEN i NOTION_DATABASE_ID
npm run dev
```

`npm run build` generuje statyczny `dist/`. Build wymaga dostępu do Notion (fetch w `getStaticPaths`/`getBooks()`) — błąd API przy buildzie jest traktowany jako błąd builda, nie stan runtime.

## Setup Notion → Vercel (rebuild po zmianie w bazie)

1. **Integracja Notion**: wejdź na [notion.so/my-integrations](https://www.notion.so/my-integrations), utwórz nową integrację typu „Internal", skopiuj **Internal Integration Token** (zaczyna się od `ntn_` lub `secret_`) → to jest `NOTION_TOKEN`.
2. W bazie „Radek Czyta Książki Reads" w Notion: `•••` (menu bazy) → **Connections** → dodaj swoją integrację, żeby miała dostęp do odczytu.
3. `NOTION_DATABASE_ID` to fragment URL-a bazy (32-znakowy hex, ewentualnie z myślnikami) — np. z linku `notion.so/workspace/<ID>?v=...`.
4. **Vercel**: zaimportuj repo jako nowy projekt, w **Settings → Environment Variables** dodaj `NOTION_TOKEN` i `NOTION_DATABASE_ID` (Production + Preview).
5. **Deploy Hook**: **Settings → Git → Deploy Hooks** w Vercel, utwórz hook (np. nazwa „notion-update", branch `main`), skopiuj wygenerowany URL.
6. **Notion → Vercel webhook**: Notion nie wysyła natywnie webhooków po edycji wiersza w bazie — potrzebny pośrednik (np. **Notion Automations** z akcją „Send webhook", jeśli dostępne na Twoim planie, albo **Make**/**Zapier** z triggerem „Notion: Database item updated" → akcja „Webhook: POST” na URL Deploy Hooka).
7. Po skonfigurowaniu: zmiana w bazie (np. dopisanie oceny po skończeniu książki) wyzwala automatycznie nowy build na Vercel.

**Świadomy kompromis**: treść odświeża się dopiero po rebuildzie (SSG), nie natychmiast — cena za zero JS i maksymalną szybkość ładowania na mobile.

## Struktura

```
src/
  lib/        — notion.ts (getBooks), slugify, sanitize-url, notion-blocks (render review), youtube, types
  data/       — genres.ts (mapowanie gatunek -> hue)
  i18n/       — dict.ts (słownik PL/EN), T.astro (statyczny i18n bez przeładowania)
  components/ — Cover, GenreTag, StarRow, FormatIcon, LangFlag, kafelki książek, BuyLinks, LangSwitcher
  layouts/    — BaseLayout.astro
  pages/      — index (półka), recenzje/[slug], o-mnie, insta, rss.xml
  styles/     — global.css (zmienne CSS)
```

## `/designs` — referencje wizualne (nie kod produkcyjny)

Folder `designs/` zawiera oryginalne prototypy React/Babel użyte jako hi-fi referencja wyglądu przy budowie (Wariant C dla półki, Design 1 „Dossier" dla recenzji, insta-d1 dla `/insta`). Zostały odtworzone 1:1 w Astro + czystym CSS — `designs/` można bezpiecznie usunąć z repo produkcyjnego, zostawiono je na razie dla łatwego porównania.

## Znane uproszczenia / TODO

- `series`, `tldr` — celowo poza zakresem v1 (patrz `Prompt - Claude Code.md`, TODO v1.1).
- Newsletter — tylko miejsce na formularz, bez backendu maili.
- `/insta` nie obsługuje dynamicznej liczby książek przez query param (statyczny SSG) — domyślnie pokazuje do 3 pozycji z „Teraz czytam".
