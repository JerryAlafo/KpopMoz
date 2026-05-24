import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Music, Users } from "lucide-react";
import { getArtistBySlug, getDynamicArtists } from "@/lib/music-feed";
import { Marquee } from "@/components/shared/Marquee";
import type { Artist } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function artistVisualStyle(artist: Artist) {
  if (!artist.imageUrl) return { background: artist.bg };

  return {
    backgroundImage: `linear-gradient(180deg, rgba(10,10,10,0.08), rgba(10,10,10,0.6)), url("${artist.imageUrl.replace(/["\\\n\r]/g, "")}")`,
    backgroundPosition: "center",
    backgroundSize: "cover",
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);
  if (!artist) return {};

  return {
    title: `${artist.name} — KPOP.MZ`,
    description: `Faixas de ${artist.name} carregadas a partir de fonte musical externa.`,
  };
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);
  if (!artist) notFound();

  const related = (await getDynamicArtists(12))
    .filter((item) => item.id !== artist.id)
    .slice(0, 4);

  return (
    <>
      <section
        className="relative pt-28 lg:pt-36 pb-0 overflow-hidden grain bg-ink"
        style={artistVisualStyle(artist)}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/20 to-bone" />
        <div
          aria-hidden
          className="absolute right-[-2rem] top-8 hangul-deco font-black text-bone/[0.12] select-none pointer-events-none leading-none"
          style={{ fontSize: "clamp(6rem, 18vw, 18rem)" }}
        >
          KPOP
        </div>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 relative">
          <Link
            href="/artistas"
            className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-bone/70 hover:text-bone transition-colors mb-8"
          >
            <ArrowLeft size={13} strokeWidth={2} />
            Todos os artistas
          </Link>

          <div className="pb-20 lg:pb-28">
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="bg-bone text-ink font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5">
                {artist.type}
              </span>
              <span className="bg-coral text-ink font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5">
                Fonte real
              </span>
            </div>
            <div className="font-mono text-base sm:text-lg text-bone/70 mb-3">
              {artist.genre ?? "Catálogo musical"}
            </div>
            <h1
              className="font-display font-black tracking-[-0.03em] leading-[0.88] text-bone"
              style={{ fontSize: "clamp(3rem, 12vw, 10rem)" }}
            >
              {artist.name}
            </h1>
          </div>
        </div>
      </section>

      <section className="bg-ink text-bone border-b border-bone/10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-bone/10">
            {[
              { label: "Fonte", value: "iTunes" },
              { label: "Género", value: artist.genre ?? "Música" },
              { label: "Faixas", value: String(artist.topTracks.length) },
              { label: "Perfil", value: artist.sourceUrl ? "Externo" : "Indisponível" },
            ].map(({ label, value }) => (
              <div key={label} className="py-6 lg:py-8 px-4 lg:px-6 first:pl-0">
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-bone/50 mb-1">
                  {label}
                </div>
                <div className="font-display font-bold text-xl sm:text-2xl lg:text-3xl leading-tight">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-7 space-y-10">
              <div>
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-coral flex items-center gap-3 mb-4">
                  <span className="inline-block w-6 h-px bg-coral" />
                  <span>Sobre</span>
                </div>
                <p className="text-base sm:text-lg text-ink/75 leading-[1.85]">
                  Este perfil é montado em tempo real a partir de dados públicos de música.
                  Por isso só mostramos campos que vêm da fonte externa, sem agência,
                  seguidores ou datas inventadas.
                </p>
              </div>

              <div>
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-coral flex items-center gap-3 mb-6">
                  <span className="inline-block w-6 h-px bg-coral" />
                  <span>Top tracks</span>
                </div>
                <div className="space-y-2">
                  {artist.topTracks.length === 0 ? (
                    <div className="border border-ink/10 p-5 text-sm text-ink/60">
                      A fonte externa não devolveu faixas para este artista agora.
                    </div>
                  ) : artist.topTracks.map((track, i) => (
                    <div
                      key={track}
                      className="flex items-center gap-4 lg:gap-6 p-4 lg:p-5 border border-ink/10 hover:border-coral transition-colors group"
                    >
                      <div className="font-display font-black text-2xl lg:text-3xl text-ink/15 group-hover:text-coral/30 transition-colors tabular-nums shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <Music size={16} className="text-ink/30 group-hover:text-coral transition-colors shrink-0" strokeWidth={1.75} />
                      <div className="font-display font-semibold text-base lg:text-lg group-hover:text-coral transition-colors">
                        {track}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="lg:col-span-4 lg:col-start-9 space-y-5">
              <div
                className="aspect-square grain relative overflow-hidden bg-ink"
                style={artistVisualStyle(artist)}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-ink/20">
                  <div className="font-display font-black text-bone text-3xl sm:text-4xl tracking-tight">
                    {artist.name}
                  </div>
                  <div className="mt-3 font-mono text-[10px] tracking-[0.3em] uppercase text-bone/70">
                    {artist.genre ?? "K-POP"}
                  </div>
                </div>
              </div>

              {artist.sourceUrl && (
                <a
                  href={artist.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block bg-coral text-ink p-6 group hover:bg-ink hover:text-bone transition-colors"
                >
                  <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-2 opacity-70">
                    Fonte externa
                  </div>
                  <div className="font-display font-bold text-xl">
                    Abrir perfil musical
                  </div>
                  <div className="mt-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] font-semibold">
                    Ver na fonte
                    <ArrowUpRight size={14} />
                  </div>
                </a>
              )}

              <div className="border border-ink/15 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={16} strokeWidth={1.75} className="text-coral" />
                  <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/60">
                    {artist.name} em Moçambique
                  </div>
                </div>
                <p className="text-sm text-ink/70 leading-relaxed">
                  Encontra outros fãs na comunidade KM. Grupos de discussão,
                  listening parties e encontros regulares.
                </p>
                <Link
                  href="/comunidade"
                  className="mt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] hover:text-coral transition-colors"
                >
                  Entrar na KM <ArrowUpRight size={13} />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Marquee
        items={artist.topTracks.length > 0 ? artist.topTracks.concat([artist.name]) : [artist.name, artist.genre ?? "K-POP"]}
        invert
      />

      <section className="py-12 lg:py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <h2 className="font-display font-bold tracking-tight text-3xl sm:text-4xl">
              Outros artistas
            </h2>
            <Link
              href="/artistas"
              className="font-mono text-xs uppercase tracking-[0.2em] border-b border-ink hover:text-coral hover:border-coral pb-1 inline-flex items-center gap-2"
            >
              Ver todos <ArrowUpRight size={13} />
            </Link>
          </div>
          {related.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              {related.map((item, i) => (
                <Link
                  key={item.id}
                  href={`/artistas/${item.slug}`}
                  className="group flex flex-col card-tilt"
                >
                  <div
                    className="relative aspect-square overflow-hidden grain bg-ink"
                    style={artistVisualStyle(item)}
                  >
                    <div className="absolute top-3 left-3 bg-bone text-ink font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-1">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-display font-black text-2xl text-bone leading-none tracking-tight">
                        {item.name}
                      </h3>
                    </div>
                  </div>
                  <div className="bg-ink text-bone p-3">
                    <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase">
                      <span>{item.genre ?? "Música"}</span>
                      <span>Real</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
