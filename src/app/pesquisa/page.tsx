"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X, ArrowUpRight, MapPin, Clock, Calendar } from "lucide-react";
import { news } from "@/data/news";
import { events } from "@/data/events";
import { artists } from "@/data/artists";
import { talents } from "@/data/talents";
import { learnTopics } from "@/data/learn";
import { formatDate } from "@/lib/utils";

type ResultType = "news" | "events" | "artists" | "talents" | "learn";

interface SearchResult {
  type: ResultType;
  id: string;
  title: string;
  subtitle: string;
  href: string;
  bg: string;
  tag: string;
}

const suggestions = ["BTS", "BLACKPINK", "Random Dance", "Festival", "Hangul", "Bias", "Cover Dance", "Maputo"];

function useSearch(query: string): SearchResult[] {
  return useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    news.forEach((n) => {
      if (n.title.toLowerCase().includes(q) || n.excerpt.toLowerCase().includes(q) || n.tags.some((t) => t.toLowerCase().includes(q))) {
        results.push({ type: "news", id: n.id, title: n.title, subtitle: `${n.category} · ${formatDate(n.publishedAt)}`, href: `/noticias/${n.slug}`, bg: n.imageBg, tag: "Notícia" });
      }
    });

    events.forEach((e) => {
      if (e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.city.toLowerCase().includes(q)) {
        results.push({ type: "events", id: e.id, title: e.title, subtitle: `${e.city} · ${e.date}`, href: `/eventos/${e.slug}`, bg: e.coverBg, tag: "Evento" });
      }
    });

    artists.forEach((a) => {
      if (a.name.toLowerCase().includes(q) || (a.koreanName ?? "").toLowerCase().includes(q) || (a.fandomName ?? "").toLowerCase().includes(q)) {
        results.push({ type: "artists", id: a.id, title: a.name, subtitle: `${a.fandomName} · est. ${a.debutYear}`, href: `/artistas/${a.slug}`, bg: a.bg, tag: "Artista" });
      }
    });

    talents.forEach((t) => {
      if (t.name.toLowerCase().includes(q) || t.specialty.toLowerCase().includes(q) || t.city.toLowerCase().includes(q)) {
        results.push({ type: "talents", id: t.id, title: t.name, subtitle: `${t.specialty} · ${t.city}`, href: `/talentos/${t.slug}`, bg: t.bg, tag: "Talento" });
      }
    });

    learnTopics.forEach((l) => {
      if (l.title.toLowerCase().includes(q) || l.excerpt.toLowerCase().includes(q) || l.category.toLowerCase().includes(q)) {
        results.push({ type: "learn", id: l.id, title: l.title, subtitle: `${l.category} · ${l.duration}`, href: `/aprender/${l.slug}`, bg: "linear-gradient(135deg, #0a0a0a 0%, #2a2a2a 100%)", tag: "Aprender" });
      }
    });

    return results;
  }, [query]);
}

export default function PesquisaPage() {
  const [query, setQuery] = useState("");
  const results = useSearch(query);

  const grouped = useMemo(() => {
    const g: Partial<Record<ResultType, SearchResult[]>> = {};
    results.forEach((r) => {
      if (!g[r.type]) g[r.type] = [];
      g[r.type]!.push(r);
    });
    return g;
  }, [results]);

  const typeLabels: Record<ResultType, string> = {
    news: "Notícias",
    events: "Eventos",
    artists: "Artistas",
    talents: "Talentos",
    learn: "Aprender",
  };

  return (
    <>
      {/* Search hero */}
      <section className="pt-28 lg:pt-36 pb-0 relative overflow-hidden bg-bone">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-coral flex items-center gap-3 mb-6">
            <span className="inline-block w-6 h-px bg-coral" />
            <span>Pesquisa</span>
          </div>
          <h1
            className="font-display font-bold tracking-tight leading-[0.9] mb-8"
            style={{ fontSize: "clamp(2rem, 7vw, 6rem)" }}
          >
            O que procuras<br />
            <span className="italic text-coral">hoje?</span>
          </h1>

          {/* Search input */}
          <div className="relative border-b-2 border-ink focus-within:border-coral transition-colors pb-2 max-w-4xl">
            <div className="flex items-center gap-4">
              <Search size={24} strokeWidth={1.75} className="text-ink/50 shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisa artistas, eventos, talentos, notícias..."
                className="flex-1 bg-transparent font-display font-semibold text-2xl sm:text-3xl lg:text-4xl placeholder:text-ink/30 focus:outline-none tracking-tight"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="w-10 h-10 flex items-center justify-center border border-ink/20 hover:border-ink hover:bg-ink hover:text-bone transition-colors shrink-0"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Suggestions */}
          {!query && (
            <div className="mt-8 flex flex-wrap gap-2 pb-12">
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/50 self-center mr-2">
                Sugestões:
              </span>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="px-4 py-2 border border-ink/20 font-mono text-xs uppercase tracking-[0.2em] hover:border-coral hover:text-coral transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      {query.trim().length >= 2 && (
        <section className="py-10 lg:py-16">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
            {results.length === 0 ? (
              <div className="py-20 text-center">
                <div className="font-display font-black text-6xl sm:text-8xl text-ink/10 mb-4">
                  ?
                </div>
                <p className="font-display font-bold text-2xl sm:text-3xl text-ink/50">
                  Sem resultados para "{query}"
                </p>
                <p className="mt-3 font-mono text-sm text-ink/40 tracking-wide">
                  Tenta outro termo ou navega pelas secções acima.
                </p>
              </div>
            ) : (
              <div>
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink/60 mb-8 pb-4 border-b border-ink/10">
                  {results.length} resultado{results.length !== 1 ? "s" : ""} para "{query}"
                </div>

                <div className="space-y-12 lg:space-y-16">
                  {(Object.keys(grouped) as ResultType[]).map((type) => (
                    <div key={type}>
                      <h2 className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-ink/60 mb-5 flex items-center gap-3">
                        <span className="inline-block w-4 h-px bg-coral" />
                        {typeLabels[type]}
                        <span className="text-coral">({grouped[type]!.length})</span>
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                        {grouped[type]!.map((result) => (
                          <Link
                            key={result.id}
                            href={result.href}
                            className="group flex gap-4 p-4 border border-ink/10 hover:border-coral transition-colors"
                          >
                            <div
                              className="shrink-0 w-16 h-16 grain relative"
                              style={{ background: result.bg }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center font-mono text-[9px] tracking-[0.15em] uppercase text-bone font-semibold">
                                {result.tag}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-display font-semibold text-base leading-snug group-hover:text-coral transition-colors line-clamp-2">
                                {result.title}
                              </h3>
                              <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/50 mt-1 truncate">
                                {result.subtitle}
                              </div>
                            </div>
                            <ArrowUpRight size={16} className="opacity-30 group-hover:opacity-100 shrink-0 mt-0.5" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* No query state — show popular sections */}
      {!query && (
        <section className="py-16 lg:py-20 bg-bone border-t border-ink/10">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
            <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight mb-8">
              Explorar por secção
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              {[
                { label: "Notícias", href: "/noticias", bg: "linear-gradient(135deg, #ff3d68 0%, #ffd23f 100%)" },
                { label: "Eventos", href: "/eventos", bg: "linear-gradient(135deg, #0a0a0a 0%, #ff3d68 100%)" },
                { label: "Artistas", href: "/artistas", bg: "linear-gradient(135deg, #ff3d68 0%, #ff5a82 100%)" },
                { label: "Talentos", href: "/talentos", bg: "linear-gradient(135deg, #3a5cff 0%, #7af0c8 100%)" },
                { label: "Marketplace", href: "/marketplace", bg: "linear-gradient(135deg, #ffd23f 0%, #ff3d68 100%)" },
                { label: "Aprender", href: "/aprender", bg: "linear-gradient(135deg, #0a0a0a 0%, #3a5cff 100%)" },
                { label: "Comunidade", href: "/comunidade", bg: "linear-gradient(135deg, #7af0c8 0%, #ffd23f 100%)" },
                { label: "Sobre a KM", href: "/sobre", bg: "linear-gradient(135deg, #ff5a82 0%, #ffd23f 100%)" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group relative aspect-[4/3] overflow-hidden grain"
                  style={{ background: item.bg }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="font-display font-bold text-lg sm:text-xl text-bone group-hover:text-coral transition-colors flex items-center gap-2">
                      {item.label}
                      <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
