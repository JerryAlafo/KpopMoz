"use client";

import Link from "next/link";
import { events } from "@/data/events";
import { news } from "@/data/news";
import { ArrowUpRight, Calendar, Newspaper, Bell, Zap } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { formatDate } from "@/lib/utils";

const monthMap: Record<string, string> = {
  "01": "JAN", "02": "FEV", "03": "MAR", "04": "ABR", "05": "MAI", "06": "JUN",
  "07": "JUL", "08": "AGO", "09": "SET", "10": "OUT", "11": "NOV", "12": "DEZ",
};

export default function ContaDashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const upcomingEvents = events.slice(0, 3);
  const latestNews = news.slice(0, 4);

  const stats = [
    { label: "Eventos inscritos", value: "3", icon: Calendar, href: "/conta/eventos" },
    { label: "Artigos guardados", value: "7", icon: Newspaper, href: "/conta/favoritos" },
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
          {upcomingEvents.map((event) => {
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
          {latestNews.map((item) => (
            <Link
              key={item.id}
              href={`/noticias/${item.slug}`}
              className="group flex gap-3 p-4 border border-ink/10 hover:border-ink transition-colors"
            >
              <div
                className="shrink-0 w-14 h-14 grain"
                style={{ background: item.imageBg }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-coral mb-1">
                  {item.category}
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
