"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isExternalNews, newsHref, newsVisualStyle } from "@/lib/news-ui";
import { ArrowUpRight, Calendar, Newspaper, Bell, Zap } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { formatDate } from "@/lib/utils";
import type { EventItem, NewsItem } from "@/types";

const monthMap: Record<string, string> = {
  "01": "JAN", "02": "FEV", "03": "MAR", "04": "ABR", "05": "MAI", "06": "JUN",
  "07": "JUL", "08": "AGO", "09": "SET", "10": "OUT", "11": "NOV", "12": "DEZ",
};

export default function ContaDashboard() {
  const { user } = useAuth();
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    let mounted = true;

    setNewsLoading(true);
    fetch("/api/news?limit=4", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (mounted && Array.isArray(data?.items)) setLatestNews(data.items);
      })
      .catch(() => { })
      .finally(() => {
        if (mounted) setNewsLoading(false);
      });

    fetch("/api/events", { cache: "no-store" })
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { if (mounted && Array.isArray(data)) setUpcomingEvents(data.slice(0, 3)); })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  if (!user) return null;

  const stats = [
    { label: "Eventos inscritos", value: "3", icon: Calendar, href: "/conta/eventos" },
    { label: "Notícias", value: newsLoading ? "..." : String(latestNews.length), icon: Newspaper, href: "/conta/favoritos" },
    { label: "Fandoms seguidos", value: String(user.fandoms.length), icon: Zap, href: "/conta/perfil" },
    { label: "Notificações", value: "2", icon: Bell, href: "#" },
  ];

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Welcome */}
      <div>
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink/50 mb-2">
          Dashboard
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
          Olá, {user.name.split(" ")[0]}<span className="text-coral">.</span>
        </h1>
        <p className="mt-2 text-base text-ink/60 font-mono text-xs tracking-[0.15em] uppercase">
          {user.city} · {user.fandoms.join(" · ")}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} className="group border border-ink/15 hover:border-ink p-4 lg:p-5 transition-colors">
            <Icon size={16} strokeWidth={1.75} className="text-coral mb-3" />
            <div className="font-display font-black text-3xl lg:text-4xl leading-none">
              {value}
            </div>
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/50 mt-2">
              {label}
            </div>
          </Link>
        ))}
      </div>

      {/* Upcoming events */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-xl lg:text-2xl tracking-tight">
            Próximos eventos
          </h2>
          <Link href="/conta/eventos" className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/50 hover:text-coral transition-colors flex items-center gap-1">
            Ver todos <ArrowUpRight size={11} />
          </Link>
        </div>
        <div className="space-y-3">
          {upcomingEvents.map((event: EventItem) => {
            const [, month, day] = event.date.split("-");
            return (
              <Link
                key={event.id}
                href={`/eventos/${event.slug}`}
                className="group flex items-center gap-4 p-4 border border-ink/10 hover:border-ink hover:bg-ink hover:text-bone transition-all"
              >
                <div
                  className="shrink-0 w-12 h-12 grain flex flex-col items-center justify-center"
                  style={{ background: event.coverBg }}
                >
                  <div className="font-mono text-[9px] text-bone/80">{monthMap[month]}</div>
                  <div className="font-display font-black text-xl text-bone leading-none">{day}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-semibold text-base leading-tight line-clamp-1">
                    {event.title}
                  </div>
                  <div className="font-mono text-[10px] tracking-[0.15em] uppercase opacity-60 mt-0.5">
                    {event.location} · {event.city}
                  </div>
                </div>
                <div className="shrink-0 font-display font-bold text-sm">
                  {event.free ? "Grátis" : `${event.price} MZN`}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Latest news */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-xl lg:text-2xl tracking-tight">
            Notícias recentes
          </h2>
          <Link href="/noticias" className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/50 hover:text-coral transition-colors flex items-center gap-1">
            Ver todas <ArrowUpRight size={11} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
          {newsLoading ? (
            [0, 1, 2, 3].map((item) => (
              <div key={item} className="flex gap-3 p-4 border border-ink/10 animate-pulse">
                <div className="shrink-0 w-14 h-14 bg-ink/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-2 w-20 bg-ink/10" />
                  <div className="h-4 w-4/5 bg-ink/10" />
                  <div className="h-2 w-24 bg-ink/10" />
                </div>
              </div>
            ))
          ) : latestNews.length === 0 ? (
            <div className="sm:col-span-2 border border-ink/10 p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">
                Não foi possível carregar notícias agora.
              </div>
            </div>
          ) : latestNews.map((item) => (
            <Link
              key={item.id}
              href={newsHref(item)}
              target={isExternalNews(item) ? "_blank" : undefined}
              rel={isExternalNews(item) ? "noreferrer" : undefined}
              className="group flex gap-3 p-4 border border-ink/10 hover:border-ink transition-colors"
            >
              <div
                className="shrink-0 w-14 h-14 grain bg-ink"
                style={newsVisualStyle(item)}
              />
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-coral mb-1">
                  {item.sourceName ?? item.category}
                </div>
                <h3 className="font-display font-semibold text-sm leading-tight group-hover:text-coral transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-ink/40 mt-1">
                  {formatDate(item.publishedAt)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
