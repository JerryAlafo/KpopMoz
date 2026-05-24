"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Music2, Play } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { MusicItem } from "@/types";

const MUSIC_PAGE_SIZE = 24;

function songVisualStyle(song: MusicItem) {
  if (!song.imageUrl) return { background: song.bg };

  return {
    backgroundImage: `linear-gradient(180deg, rgba(10,10,10,0.05), rgba(10,10,10,0.58)), url("${song.imageUrl.replace(/["\\\n\r]/g, "")}")`,
    backgroundPosition: "center",
    backgroundSize: "cover",
  };
}

interface MusicasClientProps {
  initialSongs: MusicItem[];
}

export function MusicasClient({ initialSongs }: MusicasClientProps) {
  const [songs, setSongs] = useState(initialSongs);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialSongs.length >= MUSIC_PAGE_SIZE);
  const featured = songs[0];

  async function loadMore() {
    if (loadingMore) return;

    setLoadingMore(true);
    try {
      const response = await fetch(`/api/music?limit=${MUSIC_PAGE_SIZE}&offset=${songs.length}`, {
        cache: "no-store",
      });
      const data = response.ok ? await response.json() : null;
      const incoming = Array.isArray(data?.items) ? data.items as MusicItem[] : [];

      setSongs((current) => {
        const seen = new Set(current.map((item) => item.id));
        return current.concat(incoming.filter((item) => !seen.has(item.id)));
      });
      setHasMore(Boolean(data?.hasMore) && incoming.length > 0);
    } catch {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <>
      <section className="pt-28 lg:pt-36 pb-12 lg:pb-16 bg-ink text-bone grain relative overflow-hidden">
        <div
          aria-hidden
          className="absolute right-[-2rem] -top-12 hangul-deco font-black text-bone/[0.06] select-none pointer-events-none leading-none"
          style={{ fontSize: "clamp(8rem, 22vw, 24rem)" }}
        >
          음악
        </div>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 relative">
          <div className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-coral flex items-center gap-3 mb-4">
            <span className="inline-block w-6 h-px bg-coral" />
            <span>Catálogo / Músicas</span>
          </div>
          <h1
            className="font-display font-bold leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 9vw, 8rem)" }}
          >
            Faixas K-POP
            <br />
            <span className="italic text-coral">sempre actualizadas.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-bone/70 leading-relaxed">
            Descobre faixas, álbuns e comebacks dos teus artistas favoritos.
          </p>
        </div>
      </section>

      {featured && (
        <section className="py-12 lg:py-20 bg-bone border-b border-ink/10">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div
              className="aspect-square grain bg-ink relative overflow-hidden"
              style={songVisualStyle(featured)}
            >
              <div className="absolute top-4 left-4 bg-bone text-ink font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5">
                Destaque
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-coral mb-4">
                {featured.artistName}
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-none tracking-tight">
                {featured.title}
              </h2>
              <div className="mt-4 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">
                {featured.genre && <span>{featured.genre}</span>}
                {featured.releaseDate && <span>{formatDate(featured.releaseDate)}</span>}
                {featured.albumName && <span>{featured.albumName}</span>}
              </div>
              {featured.previewUrl && (
                <audio controls src={featured.previewUrl} className="mt-8 w-full max-w-md" />
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                {featured.artistSlug && (
                  <Link
                    href={`/artistas/${featured.artistSlug}`}
                    className="inline-flex items-center gap-2 border border-ink px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] hover:bg-ink hover:text-bone transition-colors"
                  >
                    Ver artista
                  </Link>
                )}
                {featured.sourceUrl && (
                  <a
                    href={featured.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-coral text-ink px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] hover:bg-ink hover:text-bone transition-colors"
                  >
                    Abrir fonte <ArrowUpRight size={13} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-12 lg:py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          {songs.length === 0 ? (
            <div className="py-20 text-center">
              <div className="font-display font-black text-6xl text-ink/10 mb-4">0</div>
              <p className="font-display font-bold text-2xl text-ink/50">
                Não foi possível carregar músicas agora.
              </p>
              <p className="mt-3 font-mono text-sm text-ink/40 tracking-wide">
                Tenta novamente quando a fonte externa responder.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
                {songs.map((song, index) => (
                  <article key={song.id} className="group flex flex-col border border-ink/10 hover:border-coral transition-colors">
                    <div
                      className="relative aspect-square grain bg-ink overflow-hidden"
                      style={songVisualStyle(song)}
                    >
                      <div className="absolute top-3 left-3 bg-bone text-ink font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-1">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      {song.previewUrl && (
                        <div className="absolute top-3 right-3 bg-coral text-ink p-2">
                          <Play size={13} fill="currentColor" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 lg:p-5 flex-1 flex flex-col">
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-coral mb-2">
                        {song.artistName}
                      </div>
                      <h3 className="font-display font-bold text-xl leading-tight group-hover:text-coral transition-colors">
                        {song.title}
                      </h3>
                      <div className="mt-3 space-y-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/45">
                        {song.genre && <div>{song.genre}</div>}
                        {song.releaseDate && <div>{formatDate(song.releaseDate)}</div>}
                      </div>
                      {song.previewUrl && (
                        <audio controls src={song.previewUrl} className="mt-4 w-full h-9" />
                      )}
                      <div className="mt-auto pt-5 flex flex-wrap gap-3">
                        {song.artistSlug && (
                          <Link
                            href={`/artistas/${song.artistSlug}`}
                            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] hover:text-coral transition-colors"
                          >
                            <Music2 size={12} /> Artista
                          </Link>
                        )}
                        {song.sourceUrl && (
                          <a
                            href={song.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] hover:text-coral transition-colors"
                          >
                            Fonte <ArrowUpRight size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {hasMore && (
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="inline-flex items-center justify-center gap-2 border border-ink px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] hover:bg-ink hover:text-bone transition-colors disabled:opacity-50"
                  >
                    {loadingMore ? "A carregar..." : "Ver mais músicas"}
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
