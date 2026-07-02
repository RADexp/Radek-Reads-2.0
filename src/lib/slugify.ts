// Slugify 1:1 z logiką v1: NFD normalize, usunięcie diakrytyków, lowercase,
// niealfanumeryczne -> myślnik, redukcja wielokrotnych myślników, trim krawędzi.
// "ł/Ł" nie mają dekompozycji NFD (to odrębne litery, nie litera + znak diakrytyczny),
// więc trzeba je zamienić na "l" ręcznie przed resztą pipeline'u.
export function slugify(input: string): string {
  return input
    .replace(/[łŁ]/g, 'l')
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
