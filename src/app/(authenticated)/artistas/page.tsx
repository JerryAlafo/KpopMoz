import { getDynamicArtists } from "@/lib/music-feed";
import { ArtistasClient } from "./ArtistasClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ARTISTS_PAGE_SIZE = 24;

export default async function ArtistasPage() {
  const artists = await getDynamicArtists(ARTISTS_PAGE_SIZE);

  return <ArtistasClient initialArtists={artists} />;
}
