"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { newsHref } from "@/lib/news-ui";
import type { Artist, EventItem, LearnTopic, MusicItem, NewsItem, Talent } from "@/types";

type ResultType = "news" | "events" | "artists" | "music" | "talents" | "learn";

interface SearchResult {
  type: ResultType;
  id: string;
  title: string;
  subtitle: string;
  href: string;
  bg: string;
  imageUrl?: string;
  external?: boolean;
  tag: string;
}

const SEARCH_PAGE_SIZE = 24;

const suggestions = ["BTS", "BLACKPINK", "NewJeans", "Música", "Random Dance", "Hangul", "Cover Dance", "Maputo"];

function resultVisual(result: SearchResult) {
  if (!result.imageUrl) return { background: result.bg };

  return {
    backgroundImage: `linear-gradient(180deg, rgba(10,10,10,0.1), rgba(10,10,10,0.35)), url("${result.imageUrl.replace(/["\\\n\r]/g, "")}")`,
    backgroundPosition: "center",
    backgroundSize: "cover",
  };
}

function includesQuery(value: string | undefined, query: string) {
  return (value ?? "").toLowerCase().includes(query);
}

function useSearch(
  query: string,
  liveNews: NewsItem[],
  artists: Artist[],
  music: MusicItem[],
  talents: Talent[],
  liveEvents: EventItem[],
  learnItems: LearnTopic[],
): SearchResult[] {
  return useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    liveNews.forEach((item) => {
      if (
        includesQuery(item.title, q) ||
        includesQuery(item.excerpt, q) ||
        item.tags.some((tag) => includesQuery(tag, q))
      ) {
        results.push({
          type: "news",
          id: item.id,
          title: item.title,
          subtitle: `${item.sourceName ?? item.category} · ${formatDate(item.publishedAt)}`,
          href: newsHref(item),
          bg: item.imageBg,
          imageUrl: item.imageUrl,
          external: Boolean(item.sourceUrl),
          tag: "Notícia",
        });
      }
    });

    liveEvents.forEach((event: EventItem) => {
      if (
        includesQuery(event.title, q) ||
        includesQuery(event.description, q) ||
        includesQuery(event.city, q)
      ) {
        results.push({
          type: "events",
          id: event.id,
          title: event.title,
          subtitle: `${event.city} · ${event.date}`,
          href: `/eventos/${event.slug}`,
          bg: event.coverBg,
          tag: "Evento",
        });
      }
    });

    artists.forEach((artist) => {
      if (
        includesQuery(artist.name, q) ||
        includesQuery(artist.genre, q) ||
        artist.topTracks.some((track) => includesQuery(track, q))
      ) {
        results.push({
          type: "artists",
          id: artist.id,
          title: artist.name,
          subtitle: `${artist.genre ?? artist.type} · iTunes`,
          href: `/artistas/${artist.slug}`,
          bg: artist.bg,
          imageUrl: artist.imageUrl,
          tag: "Artista",
        });
      }
    });

    music.forEach((song) => {
      if (
        includesQuery(song.title, q) ||
        includesQuery(song.artistName, q) ||
        includesQuery(song.albumName, q) ||
        includesQuery(song.genre, q)
      ) {
        results.push({
          type: "music",
          id: song.id,
          title: song.title,
          subtitle: `${song.artistName}${song.genre ? ` · ${song.genre}` : ""}`,
          href: song.sourceUrl ?? "/musicas",
          bg: song.bg,
          imageUrl: song.imageUrl,
          external: Boolean(song.sourceUrl),
          tag: "Música",
        });
      }
    });

    talents.forEach((talent) => {
      if (
        includesQuery(talent.name, q) ||
        includesQuery(talent.specialty, q) ||
        includesQuery(talent.city, q) ||
        includesQuery(talent.username, q)
      ) {
        results.push({
          type: "talents",
          id: talent.id,
          title: talent.name,
          subtitle: `${talent.specialty} · ${talent.city}`,
          href: `/talentos/${talent.slug}`,
          bg: talent.bg,
          imageUrl: talent.imageUrl,
          tag: "Talento",
        });
      }
    });

    learnItems.forEach((topic: LearnTopic) => {
      if (
        includesQuery(topic.title, q) ||
        includesQuery(topic.excerpt, q) ||
        includesQuery(topic.category, q)
      ) {
        results.push({
          type: "learn",
          id: topic.id,
          title: topic.title,
          subtitle: `${topic.category} · ${topic.duration}`,
          href: `/aprender/${topic.slug}`,
          bg: "linear-gradient(135deg, #0a0a0a 0%, #2a2a2a 100%)",
          tag: "Aprender",
        });
      }
    });

    return results;
  }, [query, liveNews, artists, music, talents]);
}

export default function PesquisaPage() {
  const [query, setQuery] = useState("");
  const [liveNews, setLiveNews] = useState<NewsItem[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [music, setMusic] = useState<MusicItem[]>([]);
  const [talents, setTalents] = useState<Talent[]>([]);
  const [liveEvents, setLiveEvents] = useState<EventItem[]>([]);
  const [learnItems, setLearnItems] = useState<LearnTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreDynamic, setHasMoreDynamic] = useState(true);
  const results = useSearch(query, liveNews, artists, music, talents, liveEvents, learnItems);

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    fetch("/api/events", { cache: "no-store" })
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { if (mounted && Array.isArray(data)) setLiveEvents(data); })
      .catch(() => {});

    fetch("/api/learn", { cache: "no-store" })
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { if (mounted && Array.isArray(data)) setLearnItems(data); })
      .catch(() => {});

    Promise.all([
      fetch(`/api/news?limit=${SEARCH_PAGE_SIZE}&offset=0`, { cache: "no-store" }).then((response) => response.ok ? response.json() : null),
      fetch(`/api/artists?limit=${SEARCH_PAGE_SIZE}&offset=0`, { cache: "no-store" }).then((response) => response.ok ? response.json() : null),
      fetch(`/api/music?limit=${SEARCH_PAGE_SIZE}&offset=0`, { cache: "no-store" }).then((response) => response.ok ? response.json() : null),
      fetch(`/api/talents?limit=${SEARCH_PAGE_SIZE}&offset=0`, { cache: "no-store" }).then((response) => response.ok ? response.json() : null),
    ])
      .then(([newsData, artistsData, musicData, talentsData]) => {
        if (!mounted) return;
        if (Array.isArray(newsData?.items)) setLiveNews(newsData.items);
        if (Array.isArray(artistsData?.items)) setArtists(artistsData.items);
        if (Array.isArray(musicData?.items)) setMusic(musicData.items);
        if (Array.isArray(talentsData?.items)) setTalents(talentsData.items);
        setHasMoreDynamic(Boolean(newsData?.hasMore || artistsData?.hasMore || musicData?.hasMore || talentsData?.hasMore));
      })
      .catch(() => { })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  async function loadMoreDynamicResults() {
    if (loadingMore) return;

    setLoadingMore(true);
    try {
      const [newsData, artistsData, musicData, talentsData] = await Promise.all([
        fetch(`/api/news?limit=${SEARCH_PAGE_SIZE}&offset=${liveNews.length}`, { cache: "no-store" }).then((response) => response.ok ? response.json() : null),
        fetch(`/api/artists?limit=${SEARCH_PAGE_SIZE}&offset=${artists.length}`, { cache: "no-store" }).then((response) => response.ok ? response.json() : null),
        fetch(`/api/music?limit=${SEARCH_PAGE_SIZE}&offset=${music.length}`, { cache: "no-store" }).then((response) => response.ok ? response.json() : null),
        fetch(`/api/talents?limit=${SEARCH_PAGE_SIZE}&offset=${talents.length}`, { cache: "no-store" }).then((response) => response.ok ? response.json() : null),
      ]);

      const nextNews = Array.isArray(newsData?.items) ? newsData.items as NewsItem[] : [];
      const nextArtists = Array.isArray(artistsData?.items) ? artistsData.items as Artist[] : [];
      const nextMusic = Array.isArray(musicData?.items) ? musicData.items as MusicItem[] : [];
      const nextTalents = Array.isArray(talentsData?.items) ? talentsData.items as Talent[] : [];

      setLiveNews((current) => {
        const seen = new Set(current.map((item) => item.id));
        return current.concat(nextNews.filter((item) => !seen.has(item.id)));
      });
      setArtists((current) => {
        const seen = new Set(current.map((item) => item.id));
        return current.concat(nextArtists.filter((item) => !seen.has(item.id)));
      });
      setMusic((current) => {
        const seen = new Set(current.map((item) => item.id));
        return current.concat(nextMusic.filter((item) => !seen.has(item.id)));
      });
      setTalents((current) => {
        const seen = new Set(current.map((item) => item.id));
        return current.concat(nextTalents.filter((item) => !seen.has(item.id)));
      });
      setHasMoreDynamic(Boolean(newsData?.hasMore || artistsData?.hasMore || musicData?.hasMore || talentsData?.hasMore));
    } catch {
      setHasMoreDynamic(false);
    } finally {
      setLoadingMore(false);
    }
  }

  const grouped = useMemo(() => {
    const groups: Partial<Record<ResultType, SearchResult[]>> = {};
    results.forEach((result) => {
      if (!groups[result.type]) groups[result.type] = [];
      groups[result.type]!.push(result);
    });
    return groups;
  }, [results]);

  const typeLabels: Record<ResultType, string> = {
    news: "Notícias",
    events: "Eventos",
    artists: "Artistas",
    music: "Músicas",
    talents: "Talentos",
    learn: "Aprender",
  };

  return (
    <>
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

          <div className="relative border-b-2 border-ink focus-within:border-coral transition-colors pb-2 max-w-4xl">
            <div className="flex items-center gap-4">
              <Search size={24} strokeWidth={1.75} className="text-ink/50 shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Pesquisa artistas, músicas, eventos, talentos, notícias..."
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

          {!query && (
            <div className="mt-8 flex flex-wrap gap-2 pb-12">
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/50 self-center mr-2">
                Sugestões:
              </span>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setQuery(suggestion)}
                  className="px-4 py-2 border border-ink/20 font-mono text-xs uppercase tracking-[0.2em] hover:border-coral hover:text-coral transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {query.trim().length >= 2 && (
        <section className="py-10 lg:py-16">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
            {loading && (
              <div className="mb-8 border border-ink/10 p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40 mb-3">
                  A carregar notícias, artistas, músicas e talentos...
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[0, 1, 2].map((item) => (
                    <div key={item} className="flex gap-4 p-4 border border-ink/10 animate-pulse">
                      <div className="w-16 h-16 bg-ink/10" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-4/5 bg-ink/10" />
                        <div className="h-2 w-32 bg-ink/10" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.length === 0 && !loading ? (
              <div className="py-20 text-center">
                <div className="font-display font-black text-6xl sm:text-8xl text-ink/10 mb-4">
                  ?
                </div>
                <p className="font-display font-bold text-2xl sm:text-3xl text-ink/50">
                  Sem resultados para "{query}"
                </p>
                <p className="mt-3 font-mono text-sm text-ink/40 tracking-wide">
                  Tenta outro termo ou navega pelas secções abaixo.
                </p>
              </div>
            ) : results.length > 0 ? (
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
                            key={`${result.type}-${result.id}`}
                            href={result.href}
                            target={result.external ? "_blank" : undefined}
                            rel={result.external ? "noreferrer" : undefined}
                            className="group flex gap-4 p-4 border border-ink/10 hover:border-coral transition-colors"
                          >
                            <div
                              className="shrink-0 w-16 h-16 grain relative bg-ink"
                              style={resultVisual(result)}
                            >
                              <div className="absolute inset-0 bg-ink/15" />
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
            ) : null}

            {!loading && hasMoreDynamic && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={loadMoreDynamicResults}
                  disabled={loadingMore}
                  className="inline-flex items-center justify-center gap-2 border border-ink px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] hover:bg-ink hover:text-bone transition-colors disabled:opacity-50"
                >
                  {loadingMore ? "A carregar..." : "Ver mais resultados"}
                  <ArrowUpRight size={13} />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {!query && (
        <section className="py-16 lg:py-20 bg-bone border-t border-ink/10">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
            <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight mb-8">
              Explorar por secção
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              {[
                { label: "Notícias", href: "/noticias", bg: "linear-gradient(135deg, #ff3d68 0%, #ffd23f 100%)" },
                { label: "Músicas", href: "/musicas", bg: "linear-gradient(135deg, #7af0c8 0%, #3a5cff 100%)" },
                { label: "Eventos", href: "/eventos", bg: "linear-gradient(135deg, #0a0a0a 0%, #ff3d68 100%)" },
                { label: "Artistas", href: "/artistas", bg: "linear-gradient(135deg, #ff3d68 0%, #ff5a82 100%)" },
                { label: "Talentos", href: "/talentos", bg: "linear-gradient(135deg, #3a5cff 0%, #7af0c8 100%)" },
                { label: "Marketplace", href: "/marketplace", bg: "linear-gradient(135deg, #ffd23f 0%, #ff3d68 100%)" },
                { label: "Aprender", href: "/aprender", bg: "linear-gradient(135deg, #0a0a0a 0%, #3a5cff 100%)" },
                { label: "Comunidade", href: "/comunidade", bg: "linear-gradient(135deg, #7af0c8 0%, #ffd23f 100%)" },
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
