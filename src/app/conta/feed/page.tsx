"use client";

import { useState } from "react";
import Link from "next/link";
import { feedPosts, type FeedPost } from "@/data/feed";
import {
  Heart, MessageCircle, Share2, Check, Newspaper, Calendar,
  Mic2, Trophy, ArrowUpRight, ImageIcon, Send, TrendingUp, Users,
} from "lucide-react";
import { useAuth } from "@/contexts/auth";

/* ── helpers ─────────────────────────────────────────── */
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Agora mesmo";
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}
function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

/* ── types ───────────────────────────────────────────── */
const TYPE_BADGE: Record<string, { label: string; cls: string; icon?: React.ReactNode }> = {
  news:      { label: "Notícia",  cls: "text-coral bg-coral/10",         icon: <Newspaper size={9} /> },
  event:     { label: "Evento",   cls: "text-blue-600 bg-blue-50",        icon: <Calendar size={9} /> },
  talent:    { label: "Talento",  cls: "text-emerald-700 bg-emerald-50",  icon: <Mic2 size={9} /> },
  milestone: { label: "Marco",    cls: "text-amber-700 bg-amber-50",      icon: <Trophy size={9} /> },
};

const FANDOM_FILTERS = ["Todos", "ARMY", "BLINK", "STAY", "ONCE", "MOA", "CARAT", "ATINY", "Bunnies"];

const TRENDING = [
  { tag: "RandomDanceJunho", count: 312 },
  { tag: "BlackpinkTour",    count: 287 },
  { tag: "StrayKidsATE",     count: 201 },
  { tag: "KpopMz8k",         count: 178 },
  { tag: "CoverDanceBeira",  count: 134 },
];

const ACTIVE_MEMBERS = [
  { name: "Yara Mucavele",  username: "@yara.dnc",    fandom: "ARMY",  bg: "linear-gradient(135deg,#ff3d68,#ffd23f)", initials: "YM" },
  { name: "Eduardo Nhaca",  username: "@eddu.edit",   fandom: "STAY",  bg: "linear-gradient(135deg,#3a5cff,#7af0c8)", initials: "EN" },
  { name: "Tânia Cossa",    username: "@tania.draws", fandom: "BLINK", bg: "linear-gradient(135deg,#7af0c8,#3a5cff)", initials: "TC" },
];

/* ── PostCard ────────────────────────────────────────── */
function PostCard({ post }: { post: FeedPost }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(
    post.reactions.reduce((s, r) => s + r.count, 0)
  );
  const [copied, setCopied] = useState(false);

  function handleLike() {
    setLiked((v) => !v);
    setLikeCount((n) => liked ? n - 1 : n + 1);
  }
  function handleShare() {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const badge = TYPE_BADGE[post.type];

  return (
    <article className="border border-ink/10 hover:border-ink/20 transition-colors bg-bone">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-4 pb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 shrink-0 grain flex items-center justify-center font-display font-black text-sm text-bone"
            style={{ background: post.author.avatarBg }}
          >
            {post.author.initials}
          </div>
          <div>
            <div className="font-display font-semibold text-sm leading-tight">
              {post.author.name}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-[9px] tracking-[0.1em] text-ink/40">
                {post.author.username}
              </span>
              {post.author.fandom && (
                <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-ink/30 bg-ink/5 px-1.5 py-px">
                  {post.author.fandom}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {badge && (
            <span className={`flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.12em] px-2 py-0.5 ${badge.cls}`}>
              {badge.icon}{badge.label}
            </span>
          )}
          <span className="font-mono text-[10px] text-ink/30">{timeAgo(post.publishedAt)}</span>
        </div>
      </div>

      {/* Conteúdo */}
      {post.content && (
        <p className="px-4 pb-3 font-mono text-sm text-ink/80 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      )}

      {/* Imagem */}
      {post.image && (
        <div
          className="mx-4 mb-3 h-44 grain"
          style={{ background: post.image.bg }}
          aria-label={post.image.alt}
        />
      )}

      {/* Link de acção */}
      {post.link && (
        <div className="px-4 pb-3">
          <Link
            href={post.link.href}
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-coral hover:underline"
          >
            {post.link.label} <ArrowUpRight size={11} />
          </Link>
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {post.tags.map((tag) => (
            <span key={tag} className="font-mono text-[9px] tracking-[0.15em] uppercase text-ink/30 bg-ink/5 px-2 py-0.5">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Action bar */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-ink/8">
        <div className="flex items-center gap-1">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs transition-colors border ${
              liked
                ? "border-coral text-coral bg-coral/5"
                : "border-transparent text-ink/40 hover:text-coral hover:border-coral/30"
            }`}
          >
            <Heart size={13} strokeWidth={2} fill={liked ? "currentColor" : "none"} />
            {fmt(likeCount)}
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs text-ink/40 hover:text-ink border border-transparent hover:border-ink/10 transition-colors">
            <MessageCircle size={13} strokeWidth={2} />
            {post.comments}
          </button>
        </div>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/30 hover:text-ink border border-transparent hover:border-ink/10 transition-colors"
        >
          {copied ? <><Check size={12} strokeWidth={2.5} /> Copiado</> : <><Share2 size={12} strokeWidth={2} /> Partilhar</>}
        </button>
      </div>
    </article>
  );
}

/* ── Compose box ─────────────────────────────────────── */
function ComposeBox({ authorInitials, authorBg }: { authorInitials: string; authorBg: string }) {
  const [text, setText] = useState("");
  const [fandom, setFandom] = useState("");
  const [posted, setPosted] = useState(false);

  function handlePost() {
    if (!text.trim()) return;
    setPosted(true);
    setText("");
    setFandom("");
    setTimeout(() => setPosted(false), 2500);
  }

  return (
    <div className="border border-ink/15 bg-bone p-4 space-y-3">
      <div className="flex gap-3">
        <div
          className="w-9 h-9 shrink-0 grain flex items-center justify-center font-display font-black text-sm text-bone"
          style={{ background: authorBg }}
        >
          {authorInitials}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="O que está a acontecer no teu fandom?"
          rows={3}
          className="flex-1 bg-transparent border border-ink/15 focus:border-ink px-3 py-2 font-mono text-sm placeholder:text-ink/30 focus:outline-none transition-colors resize-none"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 pl-0 sm:pl-12">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40 hover:text-ink transition-colors border border-ink/10 hover:border-ink px-2 py-1">
            <ImageIcon size={11} /> Imagem
          </button>
          <select
            value={fandom}
            onChange={(e) => setFandom(e.target.value)}
            className="bg-bone border border-ink/10 hover:border-ink px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50 focus:outline-none transition-colors"
          >
            <option value="">Fandom</option>
            {FANDOM_FILTERS.slice(1).map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handlePost}
          disabled={!text.trim()}
          className={`flex items-center gap-2 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] border transition-colors disabled:opacity-30 ${
            posted
              ? "bg-emerald-100 border-emerald-400 text-emerald-700"
              : "bg-ink text-bone border-ink hover:bg-ink/80"
          }`}
        >
          {posted ? <><Check size={11} strokeWidth={2.5} /> Publicado</> : <><Send size={11} /> Publicar</>}
        </button>
      </div>
    </div>
  );
}

/* ── Página principal ────────────────────────────────── */
type Tab = "geral" | "seguindo" | "anuncios";
type FandomFilter = string;

export default function FeedPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("geral");
  const [fandomFilter, setFandomFilter] = useState<FandomFilter>("Todos");

  const filtered = feedPosts.filter((p) => {
    if (fandomFilter === "Todos") return true;
    return p.author.fandom === fandomFilter || p.tags?.includes(fandomFilter);
  });

  const authorInitials = user
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")
    : "KM";
  const authorBg = "#ff3d68";

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">

      {/* Coluna central */}
      <div className="space-y-4 min-w-0">

        {/* Header */}
        <div>
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink/50 mb-1">
            Conta / Feed
          </div>
          <h1 className="font-display font-bold text-3xl tracking-tight">
            Feed<span className="text-coral">.</span>
          </h1>
        </div>

        {/* Compose */}
        <ComposeBox authorInitials={authorInitials} authorBg={authorBg} />

        {/* Filtros por fandom */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {FANDOM_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFandomFilter(f)}
              className={`shrink-0 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] border transition-colors ${
                fandomFilter === f
                  ? "bg-ink text-bone border-ink"
                  : "border-ink/20 text-ink/50 hover:border-ink hover:text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Abas */}
        <div className="flex border-b border-ink/10">
          {(["geral", "seguindo", "anuncios"] as Tab[]).map((t) => {
            const labels: Record<Tab, string> = { geral: "Geral", seguindo: "A seguir", anuncios: "Anúncios" };
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] border-b-2 -mb-px transition-all ${
                  tab === t ? "border-coral text-ink" : "border-transparent text-ink/40 hover:text-ink"
                }`}
              >
                {labels[t]}
              </button>
            );
          })}
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="py-16 text-center font-mono text-xs tracking-[0.2em] uppercase text-ink/30">
              Nenhum post encontrado
            </div>
          ) : (
            filtered.map((post, i) => (
              <div
                key={post.id}
                className="animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <PostCard post={post} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Painel lateral direito */}
      <aside className="hidden xl:flex flex-col gap-5 self-start sticky top-24">

        {/* Trending */}
        <div className="border border-ink/10 p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={13} className="text-coral" strokeWidth={2} />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/60">
              Em destaque
            </span>
          </div>
          <div className="space-y-2">
            {TRENDING.map((t, i) => (
              <div key={t.tag} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="font-display font-black text-xs text-coral w-4">{i + 1}</span>
                  <span className="font-mono text-xs text-ink/70 group-hover:text-ink transition-colors">
                    #{t.tag}
                  </span>
                </div>
                <span className="font-mono text-[9px] text-ink/30">{fmt(t.count)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Membros activos */}
        <div className="border border-ink/10 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users size={13} className="text-coral" strokeWidth={2} />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/60">
              Membros activos
            </span>
          </div>
          <div className="space-y-3">
            {ACTIVE_MEMBERS.map((m) => (
              <div key={m.username} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 shrink-0 grain flex items-center justify-center font-display font-black text-xs text-bone"
                  style={{ background: m.bg }}
                >
                  {m.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-semibold text-xs leading-tight truncate">
                    {m.name}
                  </div>
                  <div className="font-mono text-[9px] text-ink/40">{m.username}</div>
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink/30 bg-ink/5 px-1.5 py-px shrink-0">
                  {m.fandom}
                </span>
              </div>
            ))}
          </div>
          <Link
            href="/comunidade"
            className="block mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-coral hover:underline"
          >
            Ver comunidade →
          </Link>
        </div>

        {/* Próximo evento */}
        <div className="border border-coral/30 bg-coral/5 p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-coral mb-2">
            Próximo evento
          </div>
          <div className="font-display font-bold text-sm leading-tight mb-1">
            Random Dance Play — Junho
          </div>
          <div className="font-mono text-[10px] text-ink/50 mb-3">
            08 Jun · Praça da Independência · Maputo
          </div>
          <Link href="/eventos/random-dance-junho-maputo" className="btn-brutal text-xs py-2">
            <Calendar size={11} /> Ver evento
          </Link>
        </div>
      </aside>

    </div>
  );
}
