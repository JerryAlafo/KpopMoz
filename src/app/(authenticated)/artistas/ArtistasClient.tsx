"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Marquee } from "@/components/shared/Marquee";
import type { Artist } from "@/types";

const ARTISTS_PAGE_SIZE = 24;

function artistVisualStyle(artist: Artist) {
  if (!artist.imageUrl) return { background: artist.bg };

  return {
    backgroundImage: `linear-gradient(180deg, rgba(10,10,10,0.05), rgba(10,10,10,0.58)), url("${artist.imageUrl.replace(/["\\\n\r]/g, "")}")`,
    backgroundPosition: "center",
    backgroundSize: "cover",
  };
}

interface ArtistasClientProps {
  initialArtists: Artist[];
}

export function ArtistasClient({ initialArtists }: ArtistasClientProps) {
  const [artists, setArtists] = useState(initialArtists);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialArtists.length >= ARTISTS_PAGE_SIZE);

  async function loadMore() {
    if (loadingMore) return;

    setLoadingMore(true);
    try {
      const response = await fetch(`/api/artists?limit=${ARTISTS_PAGE_SIZE}&offset=${artists.length}`, {
        cache: "no-store",
      });
      const data = response.ok ? await response.json() : null;
      const incoming = Array.isArray(data?.items) ? data.items as Artist[] : [];

      setArtists((current) => {
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
      <section className="pt-28 lg:pt-36 pb-12 lg:pb-16 bg-coral text-ink grain relative overflow-hidden">
        <div
          aria-hidden
          className="absolute right-[-2rem] -top-12 hangul-deco font-black text-ink/[0.06] select-none pointer-events-none leading-none"
          style={{ fontSize: "clamp(8rem, 22vw, 24rem)" }}
        >
          아티스트
        </div>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 relative">
          <div className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase flex items-center gap-3 mb-4">
            <span className="inline-block w-6 h-px bg-ink" />
            <span>Secção 05 / Discografia real</span>
          </div>
          <h1
            className="font-display font-bold leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 9vw, 8rem)" }}
          >
            A base de dados
            <br />
            <span className="italic">da indústria.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed">
            Artistas e faixas vindos de fontes musicais públicas. Sem perfis inventados,
            sem contagens fictícias.
          </p>
          <Link
            href="/musicas"
            className="mt-8 inline-flex items-center gap-2 border border-ink px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] hover:bg-ink hover:text-bone transition-colors"
          >
            Ver músicas
          </Link>
        </div>
      </section>

      <Marquee
        items={artists.length > 0 ? artists.slice(0, 12).map((artist) => artist.name) : ["K-POP", "Catálogo real", "Músicas", "Artistas"]}
        invert
        speed="slow"
      />

      <section className="py-12 lg:py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          {artists.length === 0 ? (
            <div className="py-20 text-center">
              <div className="font-display font-black text-6xl text-ink/10 mb-4">0</div>
              <p className="font-display font-bold text-2xl text-ink/50">
                Não foi possível carregar artistas agora.
              </p>
              <p className="mt-3 font-mono text-sm text-ink/40 tracking-wide">
                Tenta novamente quando a fonte externa responder.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
                {artists.map((artist, index) => (
                  <Link
                    key={artist.id}
                    href={`/artistas/${artist.slug}`}
                    className="group flex flex-col card-tilt"
                  >
                    <div
                      className="relative aspect-square overflow-hidden grain bg-ink"
                      style={artistVisualStyle(artist)}
                    >
                      <div
                        className="absolute inset-0 mix-blend-overlay opacity-30"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.4), transparent 50%)",
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-bone text-ink font-mono text-[10px] uppercase tracking-[0.2em] px-2.5 py-1">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="absolute top-3 right-3 bg-ink/75 text-bone font-mono text-[10px] uppercase tracking-[0.2em] px-2.5 py-1">
                        Real
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-display font-black text-2xl sm:text-3xl text-bone leading-none tracking-tight group-hover:text-coral transition-colors">
                          {artist.name}
                        </h3>
                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/80 mt-2">
                          {artist.genre ?? "Catálogo musical"}
                        </div>
                      </div>
                    </div>
                    <div className="bg-ink text-bone p-4 lg:p-5 space-y-3">
                      <div className="grid grid-cols-2 gap-2 font-mono text-[10px] tracking-[0.2em] uppercase">
                        <div>
                          <div className="text-bone/50">Fonte</div>
                          <div className="text-bone mt-0.5">iTunes</div>
                        </div>
                        <div>
                          <div className="text-bone/50">Tipo</div>
                          <div className="text-bone mt-0.5">{artist.type}</div>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-bone/15">
                        <div className="text-[10px] tracking-[0.2em] uppercase text-bone/50 font-mono mb-1">
                          Top tracks
                        </div>
                        <div className="text-xs text-bone/80 line-clamp-1">
                          {artist.topTracks.length > 0
                            ? artist.topTracks.slice(0, 3).join(" · ")
                            : "Sem faixas disponíveis"}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {hasMore && (
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="inline-flex items-center justify-center gap-2 border border-ink px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] hover:bg-ink hover:text-bone transition-colors disabled:opacity-50"
                  >
                    {loadingMore ? "A carregar..." : "Ver mais artistas"}
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
