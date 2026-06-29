// Long-form review content + purchase links for the book-detail demo.
// Body blocks support {p:'…'} paragraphs and {h3:'…'} sub-headings, so each
// design can render h2 (section title) + h3 (sub-head) with its own type scale.

window.RR_REVIEW = {
  bookId: 'acotar',
  rating: 2,
  // one-line verdict reused by the bento design + meta
  tldr: { pl: 'Sprawdziłem fenomen romantasy. Nie mój gatunek.', en: 'Checked the romantasy hype. Not my genre.' },

  sections: [
    {
      key: 'about',
      title: { pl: 'O czym jest „A Court of Thorns and Roses”', en: 'What “A Court of Thorns and Roses” is about' },
      blocks: [
        { p: { pl: 'A Court of Thorns and Roses (Sarah J. Maas) to jedna z najpopularniejszych książek z gatunku romantasy — połączenie romansu i fantasy, gdzie świat ludzi i świat istot magicznych są od siebie oddzielone.',
               en: 'A Court of Thorns and Roses (Sarah J. Maas) is one of the most popular romantasy novels — a blend of romance and fantasy, where the human world and the world of magical beings are kept apart.' } },
        { h3: { pl: 'Świat', en: 'The world' } },
        { p: { pl: 'Dwa królestwa rozdziela wysoki mur. Po jednej stronie bieda i strach przed magią, po drugiej — nieśmiertelni, potężni władcy rządzący dworami.',
               en: 'A high wall splits the two realms. On one side, poverty and fear of magic; on the other, immortal, powerful High Lords ruling their courts.' } },
        { h3: { pl: 'Bohaterka', en: 'The heroine' } },
        { p: { pl: 'Główna bohaterka, śmiertelniczka, po zabiciu wilka trafia do magicznego świata i zostaje wciągnięta w życie na dworze potężnego władcy. Poznaje rządzące nim zasady, jego zagrożenia i tajemnice.',
               en: 'After killing a wolf, the mortal heroine is taken into the magical world and drawn into life at a High Lord’s court — learning its rules, its dangers and its secrets.' } },
        { p: { pl: 'To pierwszy tom bardzo popularnej serii, często polecany osobom, które dopiero zaczynają przygodę z romantasy.',
               en: 'It is the first volume of a hugely popular series, often recommended to readers just starting out with romantasy.' } },
      ],
    },
    {
      key: 'who',
      title: { pl: 'Komu może się spodobać', en: 'Who might enjoy it' },
      blocks: [
        { p: { pl: 'Przede wszystkim osobom, które lubią fantasy z elementami romansu oraz rozbudowane, emocjonalne historie osadzone w magicznych światach.',
               en: 'Mostly readers who enjoy fantasy with a romance thread and rich, emotional stories set in magical worlds.' } },
        { p: { pl: 'Szczególnie przypadnie do gustu fanom długich serii, powolnego rozwoju relacji między bohaterami i mroczniejszego klimatu. Dobry punkt startowy, jeśli chcesz sprawdzić, „co to ten cały romantasy”.',
               en: 'It will especially click with fans of long series, slow-burn relationships and a darker tone. A solid entry point if you want to find out what the romantasy fuss is about.' } },
      ],
    },
    {
      key: 'notwho',
      title: { pl: 'Komu może się nie spodobać', en: 'Who might not enjoy it' },
      blocks: [
        { p: { pl: 'Osobom, które nie są fanami fantasy — bywa długa i momentami męcząca.',
               en: 'Readers who aren’t into fantasy — it gets long and, at times, tiring.' } },
        { p: { pl: 'Historia zawiera sporo brutalnych i psychologicznie trudnych scen, które bardziej przypominają horror niż klasyczny romans. Jeśli liczysz na lekki wątek miłosny, możesz się rozczarować — duża część książki koncentruje się na cierpieniu i zagrożeniu bohaterów.',
               en: 'The story has plenty of brutal, psychologically heavy scenes closer to horror than to classic romance. If you’re hoping for a light love story you may be let down — much of the book dwells on the characters’ suffering and danger.' } },
      ],
    },
    {
      key: 'mine',
      title: { pl: 'Moja opinia', en: 'My take' },
      blocks: [
        { p: { pl: 'Sięgnąłem głównie z ciekawości, żeby sprawdzić, co to za fenomen. Przesłuchałem audiobook po angielsku i niestety nie przekonał mnie do tego typu historii.',
               en: 'I picked it up mostly out of curiosity, to see what the phenomenon was about. I listened to the audiobook in English and, sadly, it didn’t win me over to this kind of story.' } },
        { p: { pl: 'Największym problemem był dla mnie ciężki, momentami przytłaczający klimat. Przeciwności, z którymi mierzą się bohaterowie, wydawały się nieproporcjonalnie duże w stosunku do ich możliwości — co odbierało mi wiarygodność i przyjemność ze śledzenia fabuły.',
               en: 'My biggest issue was the heavy, at times overwhelming, mood. The obstacles the characters face felt disproportionate to what they could realistically handle, which cost the plot its credibility and my enjoyment.' } },
        { p: { pl: 'Cieszę się, że poznałem jedną z najpopularniejszych pozycji romantasy i mam własną opinię na jej temat, ale nie planuję czytać kolejnych części.',
               en: 'I’m glad I’ve now read one of the best-known romantasy titles and have my own opinion on it, but I don’t plan to continue with the series.' } },
      ],
    },
  ],
};

// Purchase links. Each language can carry several retailers; the design shows
// a PL column and an EN column side-by-side, and hides a column when empty.
// kind drives the little icon: paper / ebook / audiobook / info.
window.RR_LINKS = {
  acotar: {
    pl: [
      { retailer: 'Empik',          kind: 'paper', url: '#' },
      { retailer: 'Lubimyczytać',   kind: 'info',  url: '#' },
    ],
    en: [
      { retailer: 'Amazon',         kind: 'ebook', url: '#' },
      { retailer: 'Audible',        kind: 'audiobook', url: '#' },
    ],
  },
};
