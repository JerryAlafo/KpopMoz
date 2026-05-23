import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { news } from "@/data/news";
import { Clock, ArrowLeft, ArrowUpRight, Tag } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Marquee } from "@/components/shared/Marquee";

export function generateStaticParams() {
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = news.find((n) => n.slug === slug);
  if (!article) return {};
  return {
    title: `${article.title} — KPOP.MZ`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = news.find((n) => n.slug === slug);
  if (!article) notFound();

  const related = news.filter((n) => n.id !== article.id).slice(0, 3);
  const categoryLabel: Record<string, string> = {
    comeback: "Comeback",
    lancamento: "Lançamento",
    tour: "Tour",
    evento: "Evento",
    industria: "Indústria",
  };

  return (
    <>
      {/* Article header */}
      <section className="pt-28 lg:pt-36 pb-8 border-b border-ink/10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-ink/60 hover:text-coral transition-colors mb-8"
          >
            <ArrowLeft size={13} strokeWidth={2} />
            Todas as notícias
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
            <div className="lg:col-span-8">
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="bg-coral text-ink font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5">
                  {categoryLabel[article.category] ?? article.category}
                </span>
                {article.featured && (
                  <span className="bg-ink text-bone font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5">
                    Destaque
                  </span>
                )}
              </div>
              <h1
                className="font-display font-bold tracking-[-0.02em] leading-[0.93]"
                style={{ fontSize: "clamp(2rem, 5.5vw, 4.5rem)" }}
              >
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-5 mt-6 font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-ink/60 pb-6 border-b border-ink/10">
                <span className="font-semibold text-ink">{article.author}</span>
                <span className="opacity-40">·</span>
                <span>{formatDate(article.publishedAt)}</span>
                <span className="opacity-40">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={11} />
                  {article.readingTime} min de leitura
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cover visual */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 mt-8 lg:mt-10">
        <div
          className="relative w-full overflow-hidden grain"
          style={{ background: article.imageBg, aspectRatio: "21/9" }}
        >
          <div
            className="absolute inset-0 mix-blend-overlay opacity-30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(0,0,0,.12) 0 2px, transparent 2px 18px)",
            }}
          />
          <div
            className="absolute right-6 bottom-6 sm:right-10 sm:bottom-8 outline-number font-display font-black text-bone leading-none select-none"
            style={{ fontSize: "clamp(4rem, 14vw, 10rem)" }}
          >
            KM
          </div>
        </div>
      </div>

      {/* Article body */}
      <section className="py-12 lg:py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Main content */}
            <article className="lg:col-span-7">
              <p className="text-xl lg:text-2xl text-ink/80 leading-relaxed font-medium mb-8 pl-5 border-l-4 border-coral">
                {article.excerpt}
              </p>

              {article.content ? (
                <div className="space-y-5">
                  {article.content.split("\n\n").map((para, i) => (
                    <p key={i} className="text-base lg:text-lg text-ink/75 leading-[1.85]">
                      {para}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-base lg:text-lg text-ink/60 leading-relaxed italic">
                  Artigo completo em breve.
                </p>
              )}

              {/* Tags */}
              <div className="mt-10 pt-8 border-t border-ink/10">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag size={13} className="text-ink/40" strokeWidth={1.75} />
                  {article.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/pesquisa?q=${encodeURIComponent(tag)}`}
                      className="px-3 py-1.5 border border-ink/15 font-mono text-[10px] uppercase tracking-[0.2em] hover:border-coral hover:text-coral transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4 lg:col-start-9 space-y-5">
              <div className="bg-ink text-bone p-6 lg:p-8">
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-bone/50 mb-3">
                  Escrito por
                </div>
                <div className="font-display font-bold text-xl lg:text-2xl mb-2">
                  {article.author}
                </div>
                <p className="text-sm text-bone/65 leading-relaxed">
                  Equipa editorial da KpopMoçambique — a maior comunidade K-POP
                  do país desde 2020.
                </p>
              </div>

              <div className="border border-ink/15 p-6">
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/50 mb-3">
                  Próximos eventos
                </div>
                <Link
                  href="/eventos"
                  className="font-display font-bold text-lg hover:text-coral transition-colors inline-flex items-center gap-2"
                >
                  Ver calendário
                  <ArrowUpRight size={16} />
                </Link>
              </div>

              <div className="border border-ink/15 p-6">
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/50 mb-3">
                  Talentos locais
                </div>
                <Link
                  href="/talentos"
                  className="font-display font-bold text-lg hover:text-coral transition-colors inline-flex items-center gap-2"
                >
                  Descobrir talentos
                  <ArrowUpRight size={16} />
                </Link>
              </div>

              <Link
                href="/comunidade"
                className="block bg-coral text-ink p-6 group hover:bg-ink hover:text-bone transition-colors"
              >
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-2 opacity-70">
                  Junta-te
                </div>
                <div className="font-display font-bold text-xl">
                  Entra na comunidade KM
                </div>
                <div className="mt-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] font-semibold">
                  Criar conta grátis
                  <ArrowUpRight size={14} />
                </div>
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <Marquee items={article.tags} />

      {/* Related articles */}
      <section className="py-12 lg:py-20 bg-bone-200/30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <h2 className="font-display font-bold tracking-tight text-3xl sm:text-4xl">
              Mais notícias
            </h2>
            <Link
              href="/noticias"
              className="font-mono text-xs uppercase tracking-[0.2em] border-b border-ink hover:text-coral hover:border-coral pb-1 inline-flex items-center gap-2"
            >
              Todas as notícias <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/noticias/${item.slug}`}
                className="group flex flex-col card-tilt"
              >
                <div
                  className="relative aspect-[4/3] overflow-hidden grain"
                  style={{ background: item.imageBg }}
                >
                  <div className="absolute top-3 left-3 bg-bone text-ink font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-1">
                    {categoryLabel[item.category] ?? item.category}
                  </div>
                </div>
                <div className="pt-4 lg:pt-5">
                  <h3 className="font-display font-bold text-lg sm:text-xl leading-tight group-hover:text-coral transition-colors">
                    {item.title}
                  </h3>
                  <div className="mt-2 font-mono text-[10px] tracking-[0.2em] uppercase text-ink/50">
                    {formatDate(item.publishedAt)} · {item.readingTime} min
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
