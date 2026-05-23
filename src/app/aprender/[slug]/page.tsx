import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { learnTopics } from "@/data/learn";
import { Clock, ArrowLeft, ArrowUpRight, BookOpen } from "lucide-react";
import { Marquee } from "@/components/shared/Marquee";

export function generateStaticParams() {
  return learnTopics.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = learnTopics.find((t) => t.slug === slug);
  if (!topic) return {};
  return {
    title: `${topic.title} — KPOP.MZ`,
    description: topic.excerpt,
  };
}

export default async function LearnArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = learnTopics.find((t) => t.slug === slug);
  if (!topic) notFound();

  const related = learnTopics
    .filter((t) => t.id !== topic.id)
    .sort((a, b) => (a.category === topic.category ? -1 : 1))
    .slice(0, 4);

  const levelColor: Record<string, string> = {
    Iniciante: "bg-mint text-ink",
    Intermédio: "bg-sunny text-ink",
    Avançado: "bg-coral text-bone",
  };

  return (
    <>
      {/* Header */}
      <section className="pt-28 lg:pt-36 pb-8 bg-ink text-bone relative overflow-hidden grain">
        <div
          aria-hidden
          className="absolute right-[-2rem] top-1/2 -translate-y-1/2 hangul-deco font-black text-bone/[0.04] select-none pointer-events-none leading-none"
          style={{ fontSize: "clamp(8rem, 20vw, 20rem)" }}
        >
          공부
        </div>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 relative">
          <Link
            href="/aprender"
            className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-bone/60 hover:text-coral transition-colors mb-8"
          >
            <ArrowLeft size={13} strokeWidth={2} />
            Centro de aprendizagem
          </Link>

          <div className="flex flex-wrap gap-2 mb-5">
            <span className="bg-coral text-ink font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5">
              {topic.category}
            </span>
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 ${levelColor[topic.level]}`}
            >
              {topic.level}
            </span>
          </div>
          <h1
            className="font-display font-bold tracking-[-0.02em] leading-[0.93] max-w-4xl"
            style={{ fontSize: "clamp(2rem, 5.5vw, 4.5rem)" }}
          >
            {topic.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 mt-6 font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-bone/60">
            <span className="inline-flex items-center gap-1.5">
              <BookOpen size={11} />
              {topic.category}
            </span>
            <span className="opacity-40">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={11} />
              {topic.duration} de leitura
            </span>
            <span className="opacity-40">·</span>
            <span>{topic.level}</span>
          </div>
        </div>
      </section>

      {/* Article body */}
      <section className="py-12 lg:py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Main content */}
            <article className="lg:col-span-7">
              <p className="text-xl lg:text-2xl text-ink/80 leading-relaxed font-medium mb-8 pl-5 border-l-4 border-coral">
                {topic.excerpt}
              </p>

              {topic.content ? (
                <div className="space-y-5">
                  {topic.content.split("\n\n").map((para, i) => (
                    <p key={i} className="text-base lg:text-lg text-ink/75 leading-[1.85]">
                      {para}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-base lg:text-lg text-ink/60 leading-relaxed italic">
                  Conteúdo completo em breve.
                </p>
              )}

              {/* CTA para workshop */}
              {topic.category === "Língua" && (
                <div className="mt-10 bg-coral text-ink p-6 lg:p-8">
                  <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-2">
                    Workshop ao vivo
                  </div>
                  <h3 className="font-display font-bold text-2xl lg:text-3xl mb-3">
                    Pratica com a comunidade.
                  </h3>
                  <p className="text-sm text-ink/80 leading-relaxed mb-5">
                    A KM organiza workshops de língua coreana online. Aprende em grupo,
                    tira dúvidas e pratica com outros fãs moçambicanos.
                  </p>
                  <Link href="/eventos" className="btn-brutal">
                    Ver workshops disponíveis
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4 lg:col-start-9 space-y-5">
              <div className="bg-ink text-bone p-6 lg:p-8">
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-bone/50 mb-3">
                  Nível
                </div>
                <div className="font-display font-bold text-2xl mb-4">{topic.level}</div>
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-bone/50 mb-1">
                  Tempo de leitura
                </div>
                <div className="font-display font-bold text-2xl">{topic.duration}</div>
              </div>

              <div className="border border-ink/15 p-6">
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/50 mb-3">
                  Mais em {topic.category}
                </div>
                <div className="space-y-3">
                  {learnTopics
                    .filter((t) => t.category === topic.category && t.id !== topic.id)
                    .slice(0, 3)
                    .map((t) => (
                      <Link
                        key={t.id}
                        href={`/aprender/${t.slug}`}
                        className="group flex items-center gap-3 text-sm hover:text-coral transition-colors"
                      >
                        <div className="w-1.5 h-1.5 bg-coral shrink-0" />
                        <span className="leading-snug">{t.title}</span>
                      </Link>
                    ))}
                  {learnTopics.filter((t) => t.category === topic.category && t.id !== topic.id).length === 0 && (
                    <p className="text-sm text-ink/50">Mais artigos em breve.</p>
                  )}
                </div>
              </div>

              <Link
                href="/comunidade"
                className="block bg-coral text-ink p-6 group hover:bg-ink hover:text-bone transition-colors"
              >
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-2 opacity-70">
                  Comunidade
                </div>
                <div className="font-display font-bold text-xl">
                  Discute com outros fãs
                </div>
                <div className="mt-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] font-semibold">
                  Entrar na KM
                  <ArrowUpRight size={14} />
                </div>
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <Marquee items={["K-POP", topic.category, "Cultura Coreana", "KM", "Moçambique"]} />

      {/* Related topics */}
      <section className="py-12 lg:py-20 bg-bone-200/30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <h2 className="font-display font-bold tracking-tight text-3xl sm:text-4xl">
              Continua a aprender
            </h2>
            <Link
              href="/aprender"
              className="font-mono text-xs uppercase tracking-[0.2em] border-b border-ink hover:text-coral hover:border-coral pb-1 inline-flex items-center gap-2"
            >
              Todos os artigos <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
            {related.map((t, i) => (
              <Link
                key={t.id}
                href={`/aprender/${t.slug}`}
                className="group flex items-center gap-4 lg:gap-6 p-4 lg:p-6 border border-ink/10 hover:border-coral hover:bg-coral hover:text-ink transition-all duration-300"
              >
                <div className="font-display font-black text-3xl lg:text-5xl leading-none opacity-25 group-hover:opacity-100 transition-opacity shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] uppercase opacity-60 mb-1.5">
                    {t.category} · {t.duration} · {t.level}
                  </div>
                  <h3 className="font-display font-bold text-lg sm:text-xl leading-tight">
                    {t.title}
                  </h3>
                </div>
                <ArrowUpRight size={18} className="opacity-30 group-hover:opacity-100 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
