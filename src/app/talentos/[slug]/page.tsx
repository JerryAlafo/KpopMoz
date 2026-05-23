import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { talents } from "@/data/talents";
import { ArrowLeft, ArrowUpRight, MapPin, Sparkles, Users, Image } from "lucide-react";
import { Marquee } from "@/components/shared/Marquee";

export function generateStaticParams() {
  return talents.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const talent = talents.find((t) => t.slug === slug);
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
  const talent = talents.find((t) => t.slug === slug);
  if (!talent) notFound();

  const related = talents
    .filter((t) => t.id !== talent.id)
    .sort((a, b) => (a.specialty === talent.specialty ? -1 : 1))
    .slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-28 lg:pt-36 pb-0 overflow-hidden grain"
        style={{ background: talent.bg }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/10 to-bone" />
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

      {/* Stats strip */}
      <section className="bg-ink text-bone border-b border-bone/10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-3 divide-x divide-bone/10">
            {[
              { label: "Especialidade", value: talent.specialty },
              { label: "Seguidores", value: talent.followers.toLocaleString() },
              { label: "Obras", value: String(talent.works) },
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

      {/* Main content */}
      <section className="py-12 lg:py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Left */}
            <div className="lg:col-span-7 space-y-10">
              {/* Bio */}
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

              {/* Works placeholder grid */}
              <div>
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-coral flex items-center gap-3 mb-6">
                  <span className="inline-block w-6 h-px bg-coral" />
                  <span>Trabalhos · {talent.works}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="relative aspect-square grain overflow-hidden group"
                      style={{ background: talent.bg }}
                    >
                      <div
                        className="absolute inset-0 mix-blend-overlay opacity-30"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(45deg, rgba(0,0,0,.1) 0 2px, transparent 2px 16px)",
                        }}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40 group-hover:opacity-70 transition-opacity">
                        <Image size={20} className="text-bone" strokeWidth={1.5} />
                        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone mt-2">
                          Obra {String(i + 1).padStart(2, "0")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/40 mt-3 text-center">
                  Galeria completa disponível em breve
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 lg:col-start-9 space-y-5">
              {/* Visual card */}
              <div
                className="aspect-[4/5] grain relative overflow-hidden"
                style={{ background: talent.bg }}
              >
                <div
                  className="absolute inset-0 mix-blend-overlay opacity-30"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, rgba(0,0,0,.1) 0 1px, transparent 1px 8px)",
                  }}
                />
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

              {/* Social links */}
              {talent.socials && talent.socials.length > 0 && (
                <div className="border border-ink/15 p-6">
                  <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/50 mb-3">
                    Redes sociais
                  </div>
                  <div className="space-y-2">
                    {talent.socials.map((s) => (
                      <div
                        key={s.platform}
                        className="flex items-center justify-between font-mono text-xs tracking-[0.15em]"
                      >
                        <span className="uppercase text-ink/60">{s.platform}</span>
                        <span className="text-coral">{s.handle}</span>
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

              <Link
                href="/talentos"
                className="block bg-coral text-ink p-6 group hover:bg-ink hover:text-bone transition-colors"
              >
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-2 opacity-70">
                  Tens talento?
                </div>
                <div className="font-display font-bold text-xl">
                  Submete o teu perfil
                </div>
                <div className="mt-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] font-semibold">
                  Candidatar-me
                  <ArrowUpRight size={14} />
                </div>
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <Marquee items={[talent.name, talent.specialty, talent.city, talent.username]} />

      {/* Related talents */}
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {related.map((t, i) => (
              <Link
                key={t.id}
                href={`/talentos/${t.slug}`}
                className="group flex flex-col card-tilt"
              >
                <div
                  className="relative aspect-[4/5] overflow-hidden grain"
                  style={{ background: t.bg }}
                >
                  <div className="absolute top-3 left-3">
                    <span className="bg-ink text-bone font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-1">
                      {t.specialty}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-display font-bold text-lg text-bone leading-tight group-hover:text-coral transition-colors">
                      {t.name}
                    </h3>
                    <div className="font-mono text-xs text-bone/70 mt-0.5">{t.username}</div>
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
