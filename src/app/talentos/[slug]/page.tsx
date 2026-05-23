import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MapPin, Sparkles, Users } from "lucide-react";
import { getDynamicTalents, getTalentBySlug } from "@/lib/talents-feed";
import { Marquee } from "@/components/shared/Marquee";
import type { Talent } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function talentVisualStyle(talent: Talent) {
  if (!talent.imageUrl) return { background: talent.bg };

  return {
    backgroundImage: `linear-gradient(180deg, rgba(10,10,10,0.08), rgba(10,10,10,0.62)), url("${talent.imageUrl.replace(/["\\\n\r]/g, "")}")`,
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
  const talent = await getTalentBySlug(slug);
  if (!talent) return {};

  return {
    title: `${talent.name} — Talentos — KPOP.MZ`,
    description: talent.bio,
  };
}

export default async function TalentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const talent = await getTalentBySlug(slug);
  if (!talent) notFound();

  const related = (await getDynamicTalents(12))
    .filter((item) => item.id !== talent.id)
    .sort((a, b) => (a.specialty === talent.specialty ? -1 : 1) - (b.specialty === talent.specialty ? -1 : 1))
    .slice(0, 4);

  return (
    <>
      <section
        className="relative pt-28 lg:pt-36 pb-0 overflow-hidden grain bg-ink"
        style={talentVisualStyle(talent)}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/10 to-bone" />
        <div
          className="absolute inset-0 mix-blend-overlay opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0,0,0,.1) 0 1px, transparent 1px 8px)",
          }}
        />
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 relative">
          <Link
            href="/talentos"
            className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-bone/70 hover:text-bone transition-colors mb-8"
          >
            <ArrowLeft size={13} strokeWidth={2} />
            Todos os talentos
          </Link>

          <div className="pb-20 lg:pb-28">
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="bg-ink text-bone font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5">
                {talent.specialty}
              </span>
              {talent.featured && (
                <span className="bg-coral text-ink font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 inline-flex items-center gap-1.5">
                  <Sparkles size={11} strokeWidth={1.75} />
                  Destaque
                </span>
              )}
            </div>
            <h1
              className="font-display font-bold tracking-[-0.02em] leading-[0.92] text-bone max-w-2xl"
              style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)" }}
            >
              {talent.name}
            </h1>
            <div className="font-mono text-base sm:text-lg text-bone/70 mt-3">
              {talent.username}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink text-bone border-b border-bone/10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-bone/10">
            {[
              { label: "Especialidade", value: talent.specialty },
              { label: "Cidade", value: talent.city },
              { label: "Obras", value: typeof talent.works === "number" ? String(talent.works) : "Fonte" },
              { label: "Seguidores", value: typeof talent.followers === "number" ? talent.followers.toLocaleString("pt") : "Fonte" },
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
                  {talent.bio}
                </p>
                <div className="flex items-center gap-2 mt-4 font-mono text-[10px] tracking-[0.2em] uppercase text-ink/60">
                  <MapPin size={12} strokeWidth={1.75} />
                  {talent.city}, Moçambique
                </div>
              </div>

              {talent.sourceUrl && (
                <a
                  href={talent.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-ink px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] hover:bg-ink hover:text-bone transition-colors"
                >
                  Abrir fonte do perfil <ArrowUpRight size={13} />
                </a>
              )}
            </div>

            <aside className="lg:col-span-4 lg:col-start-9 space-y-5">
              <div
                className="aspect-[4/5] grain relative overflow-hidden bg-ink"
                style={talentVisualStyle(talent)}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-ink text-bone font-mono text-[10px] uppercase tracking-[0.2em] px-2.5 py-1">
                    {talent.specialty}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="font-display font-bold text-2xl text-bone leading-tight">
                    {talent.name}
                  </div>
                  <div className="font-mono text-xs text-bone/70 mt-1">{talent.username}</div>
                </div>
              </div>

              {talent.socials && talent.socials.length > 0 && (
                <div className="border border-ink/15 p-6">
                  <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/50 mb-3">
                    Redes sociais
                  </div>
                  <div className="space-y-2">
                    {talent.socials.map((social) => (
                      <div
                        key={social.platform}
                        className="flex items-center justify-between font-mono text-xs tracking-[0.15em]"
                      >
                        <span className="uppercase text-ink/60">{social.platform}</span>
                        <span className="text-coral">{social.handle}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border border-ink/15 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={16} strokeWidth={1.75} className="text-coral" />
                  <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/60">
                    Comunidade KM
                  </div>
                </div>
                <p className="text-sm text-ink/70 leading-relaxed">
                  Conhece outros criadores moçambicanos e faz parte da maior
                  comunidade K-POP do país.
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

      <Marquee items={[talent.name, talent.specialty, talent.city, talent.username]} />

      <section className="py-12 lg:py-20 bg-bone-200/30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <h2 className="font-display font-bold tracking-tight text-3xl sm:text-4xl">
              Outros talentos
            </h2>
            <Link
              href="/talentos"
              className="font-mono text-xs uppercase tracking-[0.2em] border-b border-ink hover:text-coral hover:border-coral pb-1 inline-flex items-center gap-2"
            >
              Ver todos <ArrowUpRight size={13} />
            </Link>
          </div>
          {related.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/talentos/${item.slug}`}
                  className="group flex flex-col card-tilt"
                >
                  <div
                    className="relative aspect-[4/5] overflow-hidden grain bg-ink"
                    style={talentVisualStyle(item)}
                  >
                    <div className="absolute top-3 left-3">
                      <span className="bg-ink text-bone font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-1">
                        {item.specialty}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-display font-bold text-lg text-bone leading-tight group-hover:text-coral transition-colors">
                        {item.name}
                      </h3>
                      <div className="font-mono text-xs text-bone/70 mt-0.5">{item.username}</div>
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
