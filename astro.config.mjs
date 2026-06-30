import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://radekreads.pl',
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap()],
  image: {
    // Okładki to zewnętrzne URL-e (lubimyczytac.pl, amazon media) renderowane
    // wprost w <img>, celowo NIE przez astro:assets/<Image> — optymalizacja
    // zdalnych obrazów obcych domen przy buildzie jest krucha. Jeśli kiedyś
    // przejdziemy na <Image />, trzeba dopisać te domeny tutaj:
    // domains: ['s.lubimyczytac.pl', 'm.media-amazon.com'],
  },
});
