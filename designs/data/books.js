// Shared book data for Radek Reads redesign. Derived from screenshots.
// Genres limited to a small palette so chips are recognizable.
window.RR_GENRES = {
  scifi:   { pl: 'Science Fiction', en: 'Science Fiction', hue: 265 },
  fantasy: { pl: 'Fantasy',         en: 'Fantasy',         hue: 295 },
  romantasy:{ pl: 'Romantasy',      en: 'Romantasy',       hue: 340 },
  biz:     { pl: 'Biznesowa',       en: 'Business',        hue: 30  },
  psych:   { pl: 'Psychologiczna',  en: 'Psychology',      hue: 200 },
  selfdev: { pl: 'Self-dev',        en: 'Self-dev',        hue: 145 },
  history: { pl: 'Historyczna',     en: 'History',         hue: 20  },
  thriller:{ pl: 'Thriller',        en: 'Thriller',        hue: 0   },
};

window.RR_BOOKS = [
  // ─── Teraz czytam ───────────────────────────────────────────────
  { id:'toy-wars', shelf:'reading', progress:62, title:'Toy Wars', author:'Andrzej Ziemiański',
    genre:'scifi', lang:'pl', format:'audiobook', color:'#1f2937', tldr:'' },
  { id:'sponsor-magnet', shelf:'reading', progress:30, title:'Sponsor Magnet', author:'Jacek Abramowicz',
    genre:'biz', lang:'en', format:'audiobook', color:'#b53d2a', tldr:'' },
  { id:'for-we-are-many', shelf:'reading', progress:5, title:'For We Are Many', author:'Dennis E. Taylor',
    series:'Bobiverse #2', genre:'scifi', lang:'en', format:'ebook', color:'#e9c200', tldr:'' },
  { id:'perfekcjonizm', shelf:'reading', progress:15, title:'Perfekcjonizm', author:'Sharon Martin',
    genre:'psych', lang:'pl', format:'paper', color:'#0e6b6b', tldr:'' },
  { id:'the-five', shelf:'reading', progress:40, title:'The Five — Pierwsze pięć lat', author:'Tomek Karwatka',
    genre:'biz', lang:'pl', format:'paper', color:'#dc2626', tldr:'' },

  // ─── Następne ───────────────────────────────────────────────────
  { id:'how-to-think-sf', shelf:'queue', title:'Jak myśleć w fantastyczno-naukowym oświetleniu', author:'Charles Yu',
    genre:'scifi', lang:'pl', format:'paper', color:'#0a1a3a' },
  { id:'miasto-z-marzen', shelf:'queue', title:'Miasto z marzeń', author:'Kelly Weinersmith & Zach Weinersmith',
    genre:'scifi', lang:'pl', format:'paper', color:'#1f4a2a' },
  { id:'wojna-w-komencie', shelf:'queue', title:'Wojna w kosmosie', author:'Jacek Bartosiak',
    genre:'history', lang:'pl', format:'ebook', color:'#7a1c1c' },
  { id:'wladca-wszechswiata', shelf:'queue', title:'Władca wszechświata', author:'Emilio Segrè',
    genre:'history', lang:'pl', format:'paper', color:'#3a2a1a' },
  { id:'mind-magic', shelf:'queue', title:'Mind Magic', author:'James R. Doty',
    genre:'selfdev', lang:'en', format:'ebook', color:'#2a4a6a' },
  { id:'odzierki', shelf:'queue', title:'Odzierki w Grodzkim', author:'Stanisław Lem',
    genre:'scifi', lang:'pl', format:'paper', color:'#5a4a2a' },

  // ─── Przeczytane ────────────────────────────────────────────────
  { id:'mechanik', shelf:'read', rating:4, title:'Mechanik', author:'Marc Elsberg',
    genre:'thriller', lang:'pl', format:'paper', color:'#1a1a1a', tldr:'Sprawne, gęste i bardzo „inżynierskie”.' },
  { id:'mercy-of-gods', shelf:'read', rating:4, title:'The Mercy of Gods', author:'James S. A. Corey',
    genre:'scifi', lang:'en', format:'ebook', color:'#0e3a5e', tldr:'Nowy cykl od Corey — szykuje się grube SF.' },
  { id:'we-are-legion', shelf:'read', rating:5, title:'We Are Legion (We Are Bob)', author:'Dennis E. Taylor',
    series:'Bobiverse #1', genre:'scifi', lang:'en', format:'ebook', color:'#d9b900', tldr:'Najprzyjemniejsze SF jakie czytałem w tym roku.' },
  { id:'koniec-dziecinstwa', shelf:'read', rating:5, title:'Koniec dzieciństwa', author:'Arthur C. Clarke',
    genre:'scifi', lang:'pl', format:'paper', color:'#0a0a0a', tldr:'Klasyk. Ending zostaje na długo.' },
  { id:'project-hail-mary', shelf:'read', rating:5, title:'Project Hail Mary', author:'Andy Weir',
    genre:'scifi', lang:'pl', format:'audiobook', color:'#6a0a0a', tldr:'Rocky. Po prostu Rocky.' },
  { id:'critical-mass', shelf:'read', rating:4, title:'Critical Mass', author:'Daniel Suarez',
    genre:'scifi', lang:'en', format:'ebook', color:'#4a4a4a', tldr:'Twardy techno-thriller w kosmosie.' },
  { id:'casi-endless', shelf:'read', rating:3, title:"Ender's Game", author:'Orson Scott Card',
    genre:'scifi', lang:'en', format:'ebook', color:'#1a3a5a', tldr:'Trochę za młodzieżowe jak na mnie dziś.' },
  { id:'psyched-monk', shelf:'read', rating:4, title:'Psyched Monk', author:'Elizabeth Moon',
    genre:'scifi', lang:'en', format:'ebook', color:'#5a1a4a', tldr:'' },
  { id:'gap-and-gain', shelf:'read', rating:5, title:'The Gap and the Gain', author:'Dan Sullivan & Benjamin Hardy',
    genre:'selfdev', lang:'en', format:'audiobook', color:'#d97706', tldr:'Zmieniło mi sposób patrzenia na progres.' },
  { id:'acotar', shelf:'read', rating:2, title:'A Court of Thorns and Roses', author:'Sarah J. Maas',
    genre:'romantasy', lang:'en', format:'audiobook', color:'#1a0a0a', tldr:'Nie mój gatunek. Sprawdziłem.' },
  { id:'children-of-ruin', shelf:'read', rating:5, title:'Children of Ruin', author:'Adrian Tchaikovsky',
    genre:'scifi', lang:'en', format:'ebook', color:'#0a2a1a', tldr:'Octopusy. Pająki. Cudo.' },
  { id:'outer-v', shelf:'read', rating:3, title:'Outer V', author:'Daniel Suarez',
    genre:'scifi', lang:'en', format:'ebook', color:'#e0e0e0', tldr:'' },
  { id:'meditations-mortals', shelf:'read', rating:4, title:'Meditations for Mortals', author:'Oliver Burkeman',
    genre:'selfdev', lang:'en', format:'ebook', color:'#f5e6c8', tldr:'28 króciutkich esejów. Działa.' },
  { id:'kolonia', shelf:'read', rating:4, title:'Kolonia', author:'Max Czornyj',
    genre:'thriller', lang:'pl', format:'paper', color:'#2a2a2a', tldr:'' },
  { id:'spaceborn', shelf:'read', rating:4, title:'Record of a Spaceborn Few', author:'Becky Chambers',
    genre:'scifi', lang:'en', format:'ebook', color:'#3a5a8a', tldr:'Ciepłe, ludzkie SF.' },
  { id:'children-of-time', shelf:'read', rating:5, title:'Children of Time', author:'Adrian Tchaikovsky',
    genre:'scifi', lang:'en', format:'ebook', color:'#0a3a2a', tldr:'Moje SF roku.' },
  { id:'narzedzie', shelf:'read', rating:3, title:'Narzędzie do końca', author:'Asura Madarani',
    genre:'thriller', lang:'pl', format:'paper', color:'#4a0a0a', tldr:'' },
  { id:'happiness-advantage', shelf:'read', rating:4, title:'The Happiness Advantage', author:'Shawn Achor',
    genre:'selfdev', lang:'en', format:'audiobook', color:'#fbbf24', tldr:'' },
  { id:'zimne-swiatla', shelf:'read', rating:3, title:'Zimne światła', author:'Joe Hill',
    genre:'thriller', lang:'pl', format:'paper', color:'#1a1a3a', tldr:'' },
];

// Long-form review for one book to demo the detail surface
window.RR_REVIEWS = {
  'acotar': {
    about: 'A Court of Thorns and Roses (Sarah J. Maas) to jedna z najpopularniejszych książek z gatunku romantasy — mix romansu i fantasy, gdzie świat ludzi i świat istot magicznych są od siebie oddzielone. Główna bohaterka, śmiertelniczka, trafia do magicznego świata i zostaje wciągnięta w życie na dworze potężnego władcy.',
    who:   'Spodoba się fanom fantasy z romansem, długim seriom i bohaterom o mrocznym klimacie. Dobry punkt startowy dla osoby, która chce sprawdzić co to ten cały „romantasy”.',
    notWho:'Osobom, które nie są fanami fantasy — bywa długa, momentami męcząca, a sceny brutalne i psychologicznie ciężkie bardziej przypominają horror niż klasyczny romans.',
    mine:  'Sięgnąłem głównie z ciekawości, żeby sprawdzić co to za fenomen. Przesłuchałem po angielsku i nie przekonała mnie do tego typu historii — momentami przytłaczający klimat, a sam wątek romantyczny wydawał się nieproporcjonalnie duży w stosunku do możliwości bohaterów. Cieszę się, że poznałem jedną z najpopularniejszych pozycji, ale nie planuję czytać kolejnych części.'
  }
};
