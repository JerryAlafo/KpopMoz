"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { isExternalNews, newsHref, newsVisualStyle } from "@/lib/news-ui";
import type { NewsCategory, NewsItem } from "@/types";

const NEWS_PAGE_SIZE = 18;

const categories: { label: string; value: NewsCategory | "todas" }[] = [
  { label: "Todas", value: "todas" },
  { label: "Comeback", value: "comeback" },
  { label: "Lançamento", value: "lancamento" },
  { label: "Tour", value: "tour" },
  { label: "Evento", value: "evento" },
  { label: "Indústria", value: "industria" },
];

interface NoticiasClientProps {
  initialNews: NewsItem[];
}

export function NoticiasClient({ initialNews }: NoticiasClientProps) {
  const [active, setActive] = useState<NewsCategory | "todas">("todas");
  const [items, setItems] = useState(initialNews);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialNews.length >= NEWS_PAGE_SIZE);

  const filtered = active === "todas" ? items : items.filter((item) => item.category === active);
  const [featured, ...rest] = filtered;

  async function loadMore() {
    if (loadingMore) return;

    setLoadingMore(true);
    try {
      const response = await fetch(`/api/news?limit=${NEWS_PAGE_SIZE}&offset=${items.length}`, {
        cache: "no-store",
      });
      const data = response.ok ? await response.json() : null;
      const incoming = Array.isArray(data?.items) ? data.items as NewsItem[] : [];

      setItems((current) => {
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
      <section className="pt-28 lg:pt-36 pb-12 lg:pb-16 border-b border-ink/15">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-4">
            <div className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-coral flex items-center gap-3">
              <span className="inline-block w-6 h-px bg-coral" />
              <span>Secção 01 / Notícias</span>
            </div>
            <h1
              className="font-display font-bold leading-[0.92] tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 9vw, 8rem)" }}
            >
              Notícias <span className="italic text-coral">do mundo</span>
              <br />
              K-POP, em <span className="italic">tempo real.</span>
            </h1>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setActive(category.value)}
                className={`px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] border transition-colors ${
                  active === category.value
                    ? "bg-ink text-bone border-ink"
                    : "border-ink/30 hover:border-ink hover:bg-ink hover:text-bone"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {filtered.length === 0 && (
        <section className="py-20 lg:py-28">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
            <div className="font-display font-black text-6xl text-ink/10 mb-4">?</div>
            <p className="font-display font-bold text-2xl text-ink/50">
              Sem notícias nesta categoria por agora.
            </p>
            {hasMore && (
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="mt-8 inline-flex items-center justify-center gap-2 border border-ink px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] hover:bg-ink hover:text-bone transition-colors disabled:opacity-50"
              >
                {loadingMore ? "A carregar..." : "Ver mais notícias"}
                <ArrowUpRight size={13} />
              </button>
            )}
          </div>
        </section>
      )}

      {featured && (
        <>
          <section className="py-12 lg:py-20">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
              <Link
                href={newsHref(featured)}
                target={isExternalNews(featured) ? "_blank" : undefined}
                rel={isExternalNews(featured) ? "noreferrer" : undefined}
                className="group grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
              >
                <div
                  className="relative aspect-[4/3] lg:aspect-[5/4] overflow-hidden grain bg-ink"
                  style={newsVisualStyle(featured)}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 bg-ink text-bone font-mono text-xs uppercase tracking-[0.2em] px-3 py-1.5">
                    Em destaque
                  </div>
                  <div className="absolute right-4 bottom-4 outline-number font-display font-black text-bone leading-none text-[10rem] lg:text-[14rem]">
                    01
                  </div>
                </div>
                <div>
                  <div className="font-mono text-xs tracking-[0.2em] uppercase text-coral mb-3">
                    {featured.category}
                  </div>
                  <h2 className="font-display font-bold tracking-tight leading-[1] text-4xl sm:text-5xl lg:text-6xl group-hover:text-coral transition-colors">
                    {featured.title}
                  </h2>
                  <p className="mt-5 text-lg text-ink/70 leading-relaxed max-w-xl">
                    {featured.excerpt}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4 font-mono text-xs tracking-[0.2em] uppercase text-ink/60">
                    <span>{featured.sourceName ?? featured.author}</span>
                    <span>·</span>
                    <span>{formatDate(featured.publishedAt)}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={12} /> {featured.readingTime} min
                    </span>
                    {isExternalNews(featured) && (
                      <>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1.5 text-coral">
                          Fonte <ArrowUpRight size={12} />
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </section>

          {rest.length > 0 && (
            <section className="pb-12 lg:pb-16">
              <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-6 lg:gap-x-8">
                  {rest.map((item, index) => (
                    <Link
                      key={item.id}
                      href={newsHref(item)}
                      target={isExternalNews(item) ? "_blank" : undefined}
                      rel={isExternalNews(item) ? "noreferrer" : undefined}
                      className="group flex flex-col card-tilt"
                    >
                      <div
                        className="relative aspect-[4/3] overflow-hidden grain bg-ink"
                        style={newsVisualStyle(item)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
                        <div className="absolute top-3 left-3 bg-bone text-ink font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-1">
                          {item.category}
                        </div>
                        <div className="absolute right-3 bottom-3 outline-number font-display font-black text-bone leading-none text-5xl sm:text-6xl">
                          {String(index + 2).padStart(2, "0")}
                        </div>
                      </div>
                      <div className="pt-4 lg:pt-5">
                        <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-coral">
                          {item.sourceName ?? item.author}
                        </div>
                        <h3 className="font-display font-bold text-lg sm:text-xl lg:text-2xl leading-tight group-hover:text-coral transition-colors">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm text-ink/70 leading-relaxed line-clamp-2">
                          {item.excerpt}
                        </p>
                        <div className="mt-3 flex items-center justify-between gap-3 font-mono text-[10px] tracking-[0.2em] uppercase text-ink/60">
                          <span>{formatDate(item.publishedAt)}</span>
                          <span className="inline-flex items-center gap-1">
                            <Clock size={11} /> {item.readingTime} min
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {filtered.length > 0 && hasMore && (
        <section className="pb-20 lg:pb-28">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 flex justify-center">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="inline-flex items-center justify-center gap-2 border border-ink px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] hover:bg-ink hover:text-bone transition-colors disabled:opacity-50"
            >
              {loadingMore ? "A carregar..." : "Ver mais notícias"}
              <ArrowUpRight size={13} />
            </button>
          </div>
        </section>
      )}
    </>
  );
}
