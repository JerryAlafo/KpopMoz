import type { Artist, MusicItem } from "@/types";

const MUSIC_TIMEOUT_MS = 4500;
const ITUNES_API = "https://itunes.apple.com";

const MUSIC_SEEDS = [
  "k-pop",
  "BTS",
  "BLACKPINK",
  "NewJeans",
  "Stray Kids",
  "TWICE",
  "SEVENTEEN",
  "ATEEZ",
  "IVE",
  "LE SSERAFIM",
  "ENHYPEN",
  "TXT",
  "aespa",
  "ITZY",
  "NCT",
  "NMIXX",
  "RIIZE",
  "BABYMONSTER",
  "ZEROBASEONE",
  "MONSTA X",
  "MAMAMOO",
  "Red Velvet",
  "EXO",
  "GOT7",
  "Korean pop",
];

const FALLBACK_VISUALS = [
  "linear-gradient(135deg, #ff3d68 0%, #ffd23f 100%)",
  "linear-gradient(135deg, #0a0a0a 0%, #3a5cff 100%)",
  "linear-gradient(135deg, #7af0c8 0%, #3a5cff 100%)",
  "linear-gradient(135deg, #ffd23f 0%, #ff3d68 100%)",
  "linear-gradient(135deg, #3a5cff 0%, #ff3d68 100%)",
  "linear-gradient(135deg, #ff5a82 0%, #0a0a0a 100%)",
];

const ITUNES_MAX_LIMIT = 200;

interface ItunesSong {
  wrapperType?: string;
  kind?: string;
  artistId?: number;
  collectionId?: number;
  trackId?: number;
  artistName?: string;
  collectionName?: string;
  trackName?: string;
  artistViewUrl?: string;
  artistLinkUrl?: string;
  trackViewUrl?: string;
  previewUrl?: string;
  artworkUrl100?: string;
  primaryGenreName?: string;
  releaseDate?: string;
}

interface ItunesResponse {
  results?: ItunesSong[];
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 90);
}

function fallbackVisual(index: number) {
  return FALLBACK_VISUALS[index % FALLBACK_VISUALS.length];
}

function biggerArtwork(url?: string) {
  if (!url) return "";
  return url.replace(/\/[0-9]+x[0-9]+bb(?=\.)/i, "/600x600bb");
}

function safeUrl(value?: string) {
  if (!value) return "";

  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

function publishedDate(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
}

async function fetchItunes(path: string, params: Record<string, string | number>) {
  const url = new URL(path, ITUNES_API);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, String(value)));

  const response = await fetch(url, {
    headers: {
      "User-Agent": "KPOP.MZ/1.0 (+https://kpop.mz)",
      Accept: "application/json",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(MUSIC_TIMEOUT_MS),
  });

  if (!response.ok) throw new Error("Failed to fetch music data");
  return response.json() as Promise<ItunesResponse>;
}

async function searchSongs(term: string, limit: number) {
  const data = await fetchItunes("/search", {
    term,
    media: "music",
    entity: "song",
    country: "US",
    limit: Math.min(Math.max(limit, 1), ITUNES_MAX_LIMIT),
  });

  return (data.results ?? []).filter((item) => (
    item.kind === "song" &&
    item.trackId &&
    item.trackName &&
    item.artistId &&
    item.artistName
  ));
}

async function lookupArtist(artistId: number) {
  const data = await fetchItunes("/lookup", {
    id: artistId,
    entity: "song",
    country: "US",
    limit: 30,
  });

  return data.results ?? [];
}

function uniqueSongs(songs: ItunesSong[]) {
  const seen = new Set<number>();

  return songs.filter((song) => {
    if (!song.trackId || seen.has(song.trackId)) return false;
    seen.add(song.trackId);
    return true;
  });
}

function genreScore(song: ItunesSong) {
  const genre = (song.primaryGenreName ?? "").toLowerCase();
  if (genre.includes("k-pop") || genre.includes("korean")) return 3;
  if (genre.includes("pop")) return 2;
  return 1;
}

function songDateMs(song: ItunesSong) {
  const date = new Date(song.releaseDate ?? "");
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function normalizeSong(song: ItunesSong, index: number): MusicItem {
  const artistName = song.artistName ?? "Artista K-POP";
  const title = song.trackName ?? "Música K-POP";
  const artistId = song.artistId ? String(song.artistId) : slugify(artistName);

  return {
    id: String(song.trackId ?? `${artistId}-${slugify(title)}`),
    slug: `${song.trackId ?? artistId}-${slugify(title)}`,
    title,
    artistName,
    artistSlug: `${artistId}-${slugify(artistName)}`,
    albumName: song.collectionName,
    genre: song.primaryGenreName,
    releaseDate: publishedDate(song.releaseDate),
    imageUrl: biggerArtwork(song.artworkUrl100),
    previewUrl: safeUrl(song.previewUrl),
    sourceUrl: safeUrl(song.trackViewUrl),
    bg: fallbackVisual(index),
  };
}

function mostCommon(values: string[]) {
  const counts = new Map<string, number>();
  values.filter(Boolean).forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
}

function normalizeArtist(artistId: number, songs: ItunesSong[], index: number, artistRecord?: ItunesSong): Artist | null {
  const firstSong = songs[0];
  const name = artistRecord?.artistName ?? firstSong?.artistName;
  if (!name) return null;

  const sortedSongs = uniqueSongs(songs)
    .sort((a, b) => genreScore(b) - genreScore(a) || songDateMs(b) - songDateMs(a));
  const imageSong = sortedSongs.find((song) => song.artworkUrl100) ?? firstSong;
  const topTracks = sortedSongs
    .map((song) => song.trackName)
    .filter((track): track is string => Boolean(track))
    .slice(0, 8);

  return {
    id: String(artistId),
    slug: `${artistId}-${slugify(name)}`,
    name,
    type: "artista",
    topTracks,
    bg: fallbackVisual(index),
    imageUrl: biggerArtwork(imageSong?.artworkUrl100),
    sourceUrl: safeUrl(artistRecord?.artistLinkUrl || firstSong?.artistViewUrl || firstSong?.trackViewUrl),
    genre: mostCommon(sortedSongs.map((song) => song.primaryGenreName ?? "")),
    description: "Dados musicais carregados em tempo real a partir de catálogo externo.",
  };
}

async function collectSongs(target: number) {
  const perSeed = Math.min(
    ITUNES_MAX_LIMIT,
    Math.max(12, Math.ceil(target / MUSIC_SEEDS.length) + 8)
  );
  const settled = await Promise.allSettled(MUSIC_SEEDS.map((seed) => searchSongs(seed, perSeed)));
  const songs = settled.flatMap((result) => result.status === "fulfilled" ? result.value : []);

  return uniqueSongs(songs)
    .sort((a, b) => genreScore(b) - genreScore(a) || songDateMs(b) - songDateMs(a));
}

export async function getDynamicSongs(limit = 24, offset = 0): Promise<MusicItem[]> {
  const safeLimit = Math.max(limit, 1);
  const safeOffset = Math.max(offset, 0);
  const songs = await collectSongs(safeOffset + safeLimit);
  return songs.slice(safeOffset, safeOffset + safeLimit).map(normalizeSong);
}

export async function getDynamicArtists(limit = 24, offset = 0): Promise<Artist[]> {
  const safeLimit = Math.max(limit, 1);
  const safeOffset = Math.max(offset, 0);
  const songs = await collectSongs(Math.max((safeOffset + safeLimit) * 5, 24));
  const groups = new Map<number, ItunesSong[]>();

  songs.forEach((song) => {
    if (!song.artistId) return;
    const list = groups.get(song.artistId) ?? [];
    list.push(song);
    groups.set(song.artistId, list);
  });

  return [...groups.entries()]
    .sort((a, b) => b[1].length - a[1].length || genreScore(b[1][0]) - genreScore(a[1][0]))
    .map(([artistId, artistSongs], index) => normalizeArtist(artistId, artistSongs, index))
    .filter((artist): artist is Artist => Boolean(artist))
    .slice(safeOffset, safeOffset + safeLimit);
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  const id = Number(slug.split("-")[0]);

  if (Number.isFinite(id) && id > 0) {
    const results = await lookupArtist(id);
    const artistRecord = results.find((item) => item.wrapperType === "artist");
    const songs = results.filter((item) => item.kind === "song");
    const artist = normalizeArtist(id, songs, 0, artistRecord);
    if (artist) return artist;
  }

  const artists = await getDynamicArtists(60);
  return artists.find((artist) => artist.slug === slug) ?? null;
}
