export interface FeaturedVideo {
  id: number;
  title: string;
  description?: string;
  videoUrlOrId: string;
  sortOrder: number;
  isActive: boolean;
  createdAtUtc?: string;
}

export function extractYouTubeId(urlOrId: string): string | null {
  if (!urlOrId || !urlOrId.trim()) return null;
  const input = urlOrId.trim();

  // 11 alphanumeric characters
  if (/^[A-Za-z0-9_-]{11}$/.test(input)) {
    return input;
  }

  // youtu.be/<id>
  const matchShort = input.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
  if (matchShort) return matchShort[1];

  // youtube.com/watch?v=<id>
  const matchWatch = input.match(/[?&]v=([A-Za-z0-9_-]{11})/);
  if (matchWatch) return matchWatch[1];

  // youtube.com/embed/<id> or /shorts/<id>
  const matchEmbed = input.match(/youtube\.com\/(?:embed|shorts|live)\/([A-Za-z0-9_-]{11})/);
  if (matchEmbed) return matchEmbed[1];

  return null;
}
