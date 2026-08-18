"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Bookmark, Star, Zap } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { isExternalNews, newsHref, newsVisualStyle } from "@/lib/news-ui";
import type { Artist, NewsItem, Talent } from "@/types";

type Tab = "noticias" | "artistas" | "talentos";
const FAVORITES_PAGE_SIZE = 6;

function ListLoading() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((item) => (
        <div key={item} className="flex gap-3 sm:gap-4 p-4 border border-ink/10 animate-pulse">
          <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-ink/10" />
          <div className="flex-1 space-y-2">
            <div className="h-2 w-24 bg-ink/10" />
            <div className="h-4 w-4/5 bg-ink/10" />
            <div className="h-2 w-32 bg-ink/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

function artistVisualStyle(artist: Artist) {
  if (!artist.imageUrl) return { background: artist.bg };

  return {
    backgroundImage: `linear-gradient(180deg, rgba(10,10,10,0.05), rgba(10,10,10,0.45)), url("${artist.imageUrl.replace(/["\\\n\r]/g, "")}")`,
    backgroundPosition: "center",
    backgroundSize: "cover",
  };
}

function talentVisualStyle(talent: Talent) {
  if (!talent.imageUrl) return { background: talent.bg };

  return {
    backgroundImage: `linear-gradient(180deg, rgba(10,10,10,0.05), rgba(10,10,10,0.45)), url("${talent.imageUrl.replace(/["\\\n\r]/g, "")}")`,
    backgroundPosition: "center",
    backgroundSize: "cover",
  };
}

export default function FavoritosPage() {
  const [active, setActive] = useState<Tab>("noticias");
  const [realNews, setRealNews] = useState<NewsItem[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [talents, setTalents] = useState<Talent[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [artistsLoading, setArtistsLoading] = useState(true);
  const [talentsLoading, setTalentsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState<Tab | null>(null);
  const [hasMoreNews, setHasMoreNews] = useState(true);
  const [hasMoreArtists, setHasMoreArtists] = useState(true);
  const [hasMoreTalents, setHasMoreTalents] = useState(true);

  useEffect(() => {
    let mounted = true;

    setNewsLoading(true);
    fetch(`/api/news?limit=${FAVORITES_PAGE_SIZE}&offset=0`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data?.items)) setRealNews(data.items);
        setHasMoreNews(Boolean(data?.hasMore));
      })
      .catch(() => { })
      .finally(() => {
        if (mounted) setNewsLoading(false);
      });

    setArtistsLoading(true);
    fetch(`/api/artists?limit=${FAVORITES_PAGE_SIZE}&offset=0`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data?.items)) setArtists(data.items);
        setHasMoreArtists(Boolean(data?.hasMore));
      })
      .catch(() => { })
      .finally(() => {
        if (mounted) setArtistsLoading(false);
      });

    setTalentsLoading(true);
    fetch(`/api/talents?limit=${FAVORITES_PAGE_SIZE}&offset=0`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data?.items)) setTalents(data.items);
        setHasMoreTalents(Boolean(data?.hasMore));
      })
      .catch(() => { })
      .finally(() => {
        if (mounted) setTalentsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "noticias", label: "Notícias", count: realNews.length },
    { key: "artistas", label: "Artistas", count: artists.length },
    { key: "talentos", label: "Talentos", count: talents.length },
  ];

  async function loadMore(tab: Tab) {
    if (loadingMore) return;

    const config = {
      noticias: { path: "news", offset: realNews.length },
      artistas: { path: "artists", offset: artists.length },
      talentos: { path: "talents", offset: talents.length },
    }[tab];

    setLoadingMore(tab);
    try {
      const response = await fetch(`/api/${config.path}?limit=${FAVORITES_PAGE_SIZE}&offset=${config.offset}`, {
        cache: "no-store",
      });
      const data = response.ok ? await response.json() : null;

      if (tab === "noticias") {
        const incoming = Array.isArray(data?.items) ? data.items as NewsItem[] : [];
        setRealNews((current) => {
          const seen = new Set(current.map((item) => item.id));
          return current.concat(incoming.filter((item) => !seen.has(item.id)));
        });
        setHasMoreNews(Boolean(data?.hasMore) && incoming.length > 0);
      }

      if (tab === "artistas") {
        const incoming = Array.isArray(data?.items) ? data.items as Artist[] : [];
        setArtists((current) => {
          const seen = new Set(current.map((item) => item.id));
          return current.concat(incoming.filter((item) => !seen.has(item.id)));
        });
        setHasMoreArtists(Boolean(data?.hasMore) && incoming.length > 0);
      }

      if (tab === "talentos") {
        const incoming = Array.isArray(data?.items) ? data.items as Talent[] : [];
        setTalents((current) => {
          const seen = new Set(current.map((item) => item.id));
          return current.concat(incoming.filter((item) => !seen.has(item.id)));
        });
        setHasMoreTalents(Boolean(data?.hasMore) && incoming.length > 0);
      }
    } catch {
      if (tab === "noticias") setHasMoreNews(false);
      if (tab === "artistas") setHasMoreArtists(false);
      if (tab === "talentos") setHasMoreTalents(false);
    } finally {
      setLoadingMore(null);
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink/50 mb-2">
          Conta / Favoritos
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
          Favoritos<span className="text-coral">.</span>
        </h1>
      </div>

      <div className="flex border-b border-ink/10">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 font-mono text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] border-b-2 -mb-px transition-all ${active === tab.key
              ? "border-coral text-ink"
              : "border-transparent text-ink/40 hover:text-ink"
              }`}
          >
            {tab.label}
            <span className={`text-[9px] ${active === tab.key ? "text-coral" : "text-ink/30"}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {active === "noticias" && (
        <div className="space-y-3">
          {newsLoading ? (
            <ListLoading />
          ) : realNews.length === 0 ? (
            <div className="border border-ink/10 p-5 flex items-start gap-3">
              <Bookmark size={14} className="text-coral shrink-0 mt-0.5" />
              <div>
                <div className="font-display font-semibold text-base">
                  Não foi possível carregar notícias agora.
                </div>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">
                  Tenta novamente quando as fontes externas responderem.
                </p>
              </div>
            </div>
          ) : realNews.map((item) => (
            <Link
              key={item.id}
              href={newsHref(item)}
              target={isExternalNews(item) ? "_blank" : undefined}
              rel={isExternalNews(item) ? "noreferrer" : undefined}
              className="group flex gap-3 sm:gap-4 p-4 border border-ink/10 hover:border-ink transition-colors"
            >
              <div
                className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 grain bg-ink"
                style={newsVisualStyle(item)}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-coral mb-1">
                      {item.sourceName ?? item.category}
                    </div>
                    <h3 className="font-display font-semibold text-sm leading-tight group-hover:text-coral transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                  <Bookmark size={12} className="shrink-0 text-coral mt-0.5" />
                </div>
                <div className="flex items-center gap-2 mt-2 font-mono text-[9px] tracking-[0.1em] uppercase text-ink/40">
                  <span>{formatDate(item.publishedAt)}</span>
                  <span>·</span>
                  <span>{item.readingTime} min</span>
                </div>
              </div>
            </Link>
          ))}
          {hasMoreNews && (
            <button
              onClick={() => loadMore("noticias")}
              disabled={loadingMore === "noticias"}
              className="w-full flex items-center justify-center gap-2 border border-ink/10 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] hover:border-ink hover:bg-ink hover:text-bone transition-colors disabled:opacity-50"
            >
              {loadingMore === "noticias" ? "A carregar..." : "Ver mais notícias"}
              <ArrowUpRight size={11} />
            </button>
          )}
          <div className="pt-1">
            <Link href="/noticias" className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/50 hover:text-coral transition-colors flex items-center gap-1">
              Ver todas as notícias <ArrowUpRight size={11} />
            </Link>
          </div>
        </div>
      )}

      {active === "artistas" && (
        <div className="space-y-3">
          {artistsLoading ? (
            <ListLoading />
          ) : artists.length === 0 ? (
            <div className="border border-ink/10 p-5">
              <div className="font-display font-semibold text-base">
                Não foi possível carregar artistas agora.
              </div>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">
                A lista volta quando a fonte externa de música responder.
              </p>
            </div>
          ) : artists.map((artist) => (
            <Link
              key={artist.id}
              href={`/artistas/${artist.slug}`}
              className="group flex items-center gap-3 sm:gap-4 p-4 border border-ink/10 hover:border-ink transition-colors"
            >
              <div
                className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 grain flex items-center justify-center bg-ink"
                style={artistVisualStyle(artist)}
              >
                {!artist.imageUrl && (
                  <span className="font-display font-black text-bone text-base leading-none">
                    {artist.name.slice(0, 1)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-bold text-sm sm:text-base leading-tight group-hover:text-coral transition-colors truncate">
                  {artist.name}
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                  <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-ink/40">
                    {artist.genre ?? artist.type} · iTunes
                  </span>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-1">
                <Star size={12} className="text-coral" fill="currentColor" />
                <ArrowUpRight size={13} className="text-ink/30 group-hover:text-ink transition-colors" />
              </div>
            </Link>
          ))}
          {hasMoreArtists && (
            <button
              onClick={() => loadMore("artistas")}
              disabled={loadingMore === "artistas"}
              className="w-full flex items-center justify-center gap-2 border border-ink/10 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] hover:border-ink hover:bg-ink hover:text-bone transition-colors disabled:opacity-50"
            >
              {loadingMore === "artistas" ? "A carregar..." : "Ver mais artistas"}
              <ArrowUpRight size={11} />
            </button>
          )}
          <div className="pt-1">
            <Link href="/artistas" className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/50 hover:text-coral transition-colors flex items-center gap-1">
              Ver todos os artistas <ArrowUpRight size={11} />
            </Link>
          </div>
        </div>
      )}

      {active === "talentos" && (
        <div className="space-y-3">
          {talentsLoading ? (
            <ListLoading />
          ) : talents.length === 0 ? (
            <div className="border border-ink/10 p-5">
              <div className="font-display font-semibold text-base">
                Sem talentos ligados à fonte oficial.
              </div>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">
                Quando a fonte for configurada, os perfis aparecem aqui.
              </p>
            </div>
          ) : talents.map((talent) => (
            <Link
              key={talent.id}
              href={`/talentos/${talent.slug}`}
              className="group flex items-center gap-3 sm:gap-4 p-4 border border-ink/10 hover:border-ink transition-colors"
            >
              <div
                className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 grain flex items-center justify-center bg-ink"
                style={talentVisualStyle(talent)}
              >
                {!talent.imageUrl && (
                  <span className="font-display font-black text-bone text-base leading-none">
                    {talent.name.split(" ")[0].slice(0, 1)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-bold text-sm sm:text-base leading-tight group-hover:text-coral transition-colors truncate">
                  {talent.name}
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                  <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-ink/40">
                    {talent.specialty} · {talent.city}
                  </span>
                  <span className="hidden sm:inline font-mono text-[9px] text-ink/30">
                    {talent.username}
                  </span>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-1">
                <Zap size={12} className="text-coral" fill="currentColor" />
                {typeof talent.followers === "number" && (
                  <span className="hidden sm:inline font-mono text-[10px] text-ink/40">
                    {talent.followers.toLocaleString("pt")}
                  </span>
                )}
                <ArrowUpRight size={13} className="text-ink/30 group-hover:text-ink transition-colors" />
              </div>
            </Link>
          ))}
          {hasMoreTalents && (
            <button
              onClick={() => loadMore("talentos")}
              disabled={loadingMore === "talentos"}
              className="w-full flex items-center justify-center gap-2 border border-ink/10 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] hover:border-ink hover:bg-ink hover:text-bone transition-colors disabled:opacity-50"
            >
              {loadingMore === "talentos" ? "A carregar..." : "Ver mais talentos"}
              <ArrowUpRight size={11} />
            </button>
          )}
          <div className="pt-1">
            <Link href="/talentos" className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/50 hover:text-coral transition-colors flex items-center gap-1">
              Ver todos os talentos <ArrowUpRight size={11} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
