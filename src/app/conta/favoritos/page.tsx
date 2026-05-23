"use client";

import { useState } from "react";
import Link from "next/link";
import { news } from "@/data/news";
import { artists } from "@/data/artists";
import { talents } from "@/data/talents";
import { ArrowUpRight, Bookmark, Zap, Star } from "lucide-react";
import { formatDate } from "@/lib/utils";

const savedNews = [news[0], news[1], news[2], news[4]].filter(Boolean);
const savedArtists = [artists[0], artists[1], artists[2]].filter(Boolean);
const savedTalents = [talents[0], talents[1], talents[3]].filter(Boolean);

type Tab = "noticias" | "artistas" | "talentos";

const tabs: { key: Tab; label: string; count: number }[] = [
  { key: "noticias", label: "Notícias",  count: savedNews.length },
  { key: "artistas", label: "Artistas",  count: savedArtists.length },
  { key: "talentos", label: "Talentos",  count: savedTalents.length },
];

export default function FavoritosPage() {
  const [active, setActive] = useState<Tab>("noticias");

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

      {/* Tabs — flex-1 para distribuir igualmente */}
      <div className="flex border-b border-ink/10">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 font-mono text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] border-b-2 -mb-px transition-all ${
              active === t.key
                ? "border-coral text-ink"
                : "border-transparent text-ink/40 hover:text-ink"
            }`}
          >
            {t.label}
            <span className={`text-[9px] ${active === t.key ? "text-coral" : "text-ink/30"}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Notícias */}
      {active === "noticias" && (
        <div className="space-y-3">
          {savedNews.map((item) => (
            <Link
              key={item.id}
              href={`/noticias/${item.slug}`}
              className="group flex gap-3 sm:gap-4 p-4 border border-ink/10 hover:border-ink transition-colors"
            >
              <div
                className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 grain"
                style={{ background: item.imageBg }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-coral mb-1">
                      {item.category}
                    </div>
                    <h3 className="font-display font-semibold text-sm leading-tight group-hover:text-coral transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                  <Bookmark size={12} className="shrink-0 text-coral mt-0.5" fill="currentColor" />
                </div>
                <div className="flex items-center gap-2 mt-2 font-mono text-[9px] tracking-[0.1em] uppercase text-ink/40">
                  <span>{formatDate(item.publishedAt)}</span>
                  <span>·</span>
                  <span>{item.readingTime} min</span>
                </div>
              </div>
            </Link>
          ))}
          <div className="pt-1">
            <Link href="/noticias" className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/50 hover:text-coral transition-colors flex items-center gap-1">
              Ver todas as notícias <ArrowUpRight size={11} />
            </Link>
          </div>
        </div>
      )}

      {/* Artistas */}
      {active === "artistas" && (
        <div className="space-y-3">
          {savedArtists.map((artist) => (
            <Link
              key={artist.id}
              href={`/artistas/${artist.slug}`}
              className="group flex items-center gap-3 sm:gap-4 p-4 border border-ink/10 hover:border-ink transition-colors"
            >
              <div
                className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 grain flex items-center justify-center"
                style={{ background: artist.bg }}
              >
                <span className="font-display font-black text-bone text-base leading-none">
                  {artist.name.slice(0, 1)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-bold text-sm sm:text-base leading-tight group-hover:text-coral transition-colors truncate">
                  {artist.name}
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                  <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-ink/40">
                    {artist.type} · {artist.debutYear}
                  </span>
                  <span className="hidden sm:inline font-mono text-[9px] tracking-[0.1em] uppercase bg-ink/5 px-1.5 py-px text-ink/50">
                    {artist.fandomName}
                  </span>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-1">
                <Star size={12} className="text-coral" fill="currentColor" />
                <ArrowUpRight size={13} className="text-ink/30 group-hover:text-ink transition-colors" />
              </div>
            </Link>
          ))}
          <div className="pt-1">
            <Link href="/artistas" className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/50 hover:text-coral transition-colors flex items-center gap-1">
              Ver todos os artistas <ArrowUpRight size={11} />
            </Link>
          </div>
        </div>
      )}

      {/* Talentos */}
      {active === "talentos" && (
        <div className="space-y-3">
          {savedTalents.map((talent) => (
            <Link
              key={talent.id}
              href={`/talentos/${talent.slug}`}
              className="group flex items-center gap-3 sm:gap-4 p-4 border border-ink/10 hover:border-ink transition-colors"
            >
              <div
                className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 grain flex items-center justify-center"
                style={{ background: talent.bg }}
              >
                <span className="font-display font-black text-bone text-base leading-none">
                  {talent.name.split(" ")[0].slice(0, 1)}
                </span>
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
                <span className="hidden sm:inline font-mono text-[10px] text-ink/40">
                  {talent.followers.toLocaleString("pt")}
                </span>
                <ArrowUpRight size={13} className="text-ink/30 group-hover:text-ink transition-colors" />
              </div>
            </Link>
          ))}
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
