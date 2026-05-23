import Link from "next/link";
import { artists } from "@/data/artists";
import { Marquee } from "@/components/shared/Marquee";

export default function ArtistasPage() {
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
            <span>Secção 05 / Discografia</span>
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
            Grupos, solos, agências, fandoms, discografias — tudo organizado para
            consulta rápida ou descoberta lenta.
          </p>
        </div>
      </section>

      <Marquee
        items={["1ª Geração", "2ª Geração", "3ª Geração", "4ª Geração", "5ª Geração"]}
        invert
        speed="slow"
      />

      <section className="py-12 lg:py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
            {artists.map((artist, i) => (
              <Link
                key={artist.id}
                href={`/artistas/${artist.slug}`}
                className="group flex flex-col card-tilt"
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
                  <div className="absolute top-3 left-3 bg-bone text-ink font-mono text-[10px] uppercase tracking-[0.2em] px-2.5 py-1">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="absolute top-3 right-3 hangul-deco text-bone/70 text-3xl">
                    {artist.koreanName?.slice(0, 1) ?? "K"}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-bone leading-none tracking-tight group-hover:text-coral transition-colors">
                      {artist.name}
                    </h3>
                    {artist.koreanName && (
                      <div className="hangul-deco text-bone/80 text-sm mt-1">
                        {artist.koreanName}
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-ink text-bone p-4 lg:p-5 space-y-3">
                  <div className="grid grid-cols-2 gap-2 font-mono text-[10px] tracking-[0.2em] uppercase">
                    <div>
                      <div className="text-bone/50">Fandom</div>
                      <div className="text-bone mt-0.5">{artist.fandomName}</div>
                    </div>
                    <div>
                      <div className="text-bone/50">Debut</div>
                      <div className="text-bone mt-0.5">{artist.debutYear}</div>
                    </div>
                    <div>
                      <div className="text-bone/50">Agência</div>
                      <div className="text-bone mt-0.5 truncate">{artist.agency}</div>
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
                      {artist.topTracks.slice(0, 3).join(" · ")}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
