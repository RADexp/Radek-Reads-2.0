interface GoogleBooksVolume {
  volumeInfo?: {
    description?: string;
  };
}

interface GoogleBooksResponse {
  items?: GoogleBooksVolume[];
}

export function pickGoogleBooksDescription(data: GoogleBooksResponse): string | null {
  const withDescription = (data.items ?? []).find((item) => item.volumeInfo?.description?.trim());
  return withDescription?.volumeInfo?.description?.trim() ?? null;
}

export async function fetchGoogleBooksDescription(
  title: string,
  author: string,
): Promise<string | null> {
  const query = encodeURIComponent(`intitle:${title} inauthor:${author}`);
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
  if (!res.ok) return null;
  const data = (await res.json()) as GoogleBooksResponse;
  return pickGoogleBooksDescription(data);
}
