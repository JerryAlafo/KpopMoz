import Link from "next/link";
import { artists } from "@/data/artists";
import { SectionHeader } from "@/components/shared/SectionHeader";

export function ArtistsSection() {
  const featured = artists.slice(0, 8);

  return (
    <section className="py-16 lg:py-24 bg-coral text-ink relative overflow-hidden grain">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <SectionHeader
          number="04"
          eyebrow="Discografias"
          title="Grupos & artistas em rotação"
          description="A base de dados dos grupos que mais tocam nos nossos eventos e nos nossos auscultadores."
          link={{ href: "/artistas", label: "Ver toda a discografia" }}
        />

        <div className="mt-10 lg:mt-16 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 overflow-x-auto no-scrollbar">
          <div className="flex gap-4 lg:grid lg:grid-cols-4 xl:grid-cols-4 lg:gap-5 pb-4 lg:pb-0">
            {featured.map((artist, i) => (
              <Link
                key={artist.id}
                href={`/artistas/${artist.slug}`}
                className="group shrink-0 w-[260px] sm:w-[280px] lg:w-auto card-tilt"
              >
                <div
                  className="relative aspect-square overflow-hidden grain"
                  style={{ background: artist.bg }}
                >
                  <div
                    className="absolute inset-0 mix-blend-overlay opacity-30"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.4), transparent 50%)",
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-bone text-ink font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-1">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="absolute top-3 right-3 hangul-deco text-bone/60 text-2xl sm:text-3xl">
                    {artist.koreanName?.slice(0, 1) || "K"}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-bone leading-none tracking-tight">
                      {artist.name}
                    </h3>
                    {artist.koreanName && (
                      <div className="hangul-deco text-bone/80 text-sm mt-1">
                        {artist.koreanName}
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-ink text-bone p-3 lg:p-4">
                  <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase">
                    <span>{artist.fandomName}</span>
                    <span>est. {artist.debutYear}</span>
                  </div>
                  <div className="text-xs text-bone/70 mt-2 line-clamp-1">
                    Top: {artist.topTracks.slice(0, 2).join(" · ")}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
