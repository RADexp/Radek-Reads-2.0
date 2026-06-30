// Slugify 1:1 z logiką v1: NFD normalize, usunięcie diakrytyków, lowercase,
// niealfanumeryczne -> myślnik, redukcja wielokrotnych myślników, trim krawędzi.
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function bookSlug(title: string, author: string): string {
  return slugify(`${title} ${author}`);
}
