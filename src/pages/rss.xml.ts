import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getBooks } from '../lib/notion';

export async function GET(context: APIContext) {
  const books = await getBooks();
  const reviewed = books.filter((b) => b.shelf === 'finished' && b.review && b.review.length);

  return rss({
    title: 'Radek Reads — recenzje książek',
    description: 'Najnowsze recenzje przeczytanych książek.',
    site: context.site!,
    items: reviewed.map((b) => {
      const firstParagraph = b.review?.find((block) => block.type === 'p');
      return {
        title: `${b.title} — ${b.author}`,
        link: `/recenzje/${b.id}/`,
        description: firstParagraph?.html?.replace(/<[^>]+>/g, '') ?? b.title,
      };
    }),
  });
}
