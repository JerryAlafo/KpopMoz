import { getDynamicSongs } from "@/lib/music-feed";
import { MusicasClient } from "./MusicasClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const MUSIC_PAGE_SIZE = 24;

export default async function MusicasPage() {
  const songs = await getDynamicSongs(MUSIC_PAGE_SIZE);

  return <MusicasClient initialSongs={songs} />;
}
