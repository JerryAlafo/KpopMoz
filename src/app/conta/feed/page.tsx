"use client";

import { useState, useEffect, useCallback, useRef, type ChangeEvent } from "react";
import Link from "next/link";
import type { FeedPost, EventItem } from "@/types";
import {
  ImageIcon, Send, TrendingUp, Users, UserPlus, UserCheck, Bell, X, Loader2,
  Calendar, Check, Lock,
} from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { useGuestMode } from "@/components/layout/GuestModeProvider";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { PostCard } from "@/components/feed/PostCard";

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

const FANDOM_FILTERS = ["Todos", "ARMY", "BLINK", "STAY", "ONCE", "MOA", "CARAT", "ATINY", "Bunnies"];

const FANDOM_BG: Record<string, string> = {
  ARMY:    "linear-gradient(135deg,#7B65C8,#ffd23f)",
  BLINK:   "linear-gradient(135deg,#3a5cff,#7B65C8)",
  STAY:    "linear-gradient(135deg,#0a0a0a,#3a5cff)",
  ONCE:    "linear-gradient(135deg,#ffd23f,#7af0c8)",
};

/* ── tipos ───────────────────────────────────────────── */
interface NotifItem {
  id: string;
  type: string;
  fromName: string;
  fromUser: string;
  postId: string | null;
  read: boolean;
  createdAt: string;
}

/* ── MemberRow ───────────────────────────────────────── */
function MemberRow({
  member, isFollowing, currentUserEmail, onToggle,
}: {
  member: { email: string; name: string; username: string; fandom: string; initials: string; bg: string };
  isFollowing: boolean;
  currentUserEmail: string | null;
  onToggle: (email: string, nowFollowing: boolean) => void;
}) {
  const [following, setFollowing] = useState(isFollowing);
  const [busy, setBusy] = useState(false);
  const isSelf = member.email === currentUserEmail;

  useEffect(() => { setFollowing(isFollowing); }, [isFollowing]);

  async function handleToggle() {
    if (isSelf || !currentUserEmail || busy) return;
    const prev = following;
    setFollowing((v) => !v);
    setBusy(true);
    try {
      const res = await fetch("/api/following", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: member.email }),
      });
      if (res.ok) {
        const { following: f } = await res.json();
        setFollowing(f);
        onToggle(member.email, f);
      } else {
        setFollowing(prev);
      }
    } catch {
      setFollowing(prev);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 shrink-0 grain flex items-center justify-center font-display font-black text-xs text-bone"
        style={{ background: member.bg }}
      >
        {member.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display font-semibold text-xs leading-tight truncate">{member.name}</div>
        <div className="font-mono text-[9px] text-ink/40">{member.username}</div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {member.fandom && (
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink/30 bg-ink/5 px-1.5 py-px">
            {member.fandom}
          </span>
        )}
        {!isSelf && currentUserEmail && (
          <button
            onClick={handleToggle}
            disabled={busy}
            title={following ? "Deixar de seguir" : "Seguir"}
            className={`p-1 border transition-colors disabled:opacity-50 ${
              following
                ? "border-coral/40 text-coral hover:bg-coral/5"
                : "border-ink/20 text-ink/40 hover:border-ink hover:text-ink"
            }`}
          >
            {following ? <UserCheck size={11} strokeWidth={2} /> : <UserPlus size={11} strokeWidth={2} />}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── ComposeBox ──────────────────────────────────────── */
function ComposeBox({
  authorInitials, authorBg, authorAvatarUrl, userEmail, onPosted,
}: {
  authorInitials: string;
  authorBg: string;
  authorAvatarUrl?: string | null;
  userEmail: string | null;
  onPosted: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [text,         setText]         = useState("");
  const [fandom,       setFandom]       = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl,     setImageUrl]     = useState<string | null>(null);
  const [uploading,    setUploading]    = useState(false);
  const [uploadErr,    setUploadErr]    = useState("");
  const [posting,      setPosting]      = useState(false);
  const [success,      setSuccess]      = useState(false);

  async function handleImagePick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Mostrar preview imediatamente
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    setImageUrl(null);
    setUploadErr("");
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res  = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setUploadErr(data.error ?? "Erro no upload");
        // Mantém o preview mas marca como falhado
        setImageUrl(null);
        return;
      }
      setImageUrl(data.url);
      setUploadErr("");
    } catch {
      setUploadErr("Erro de ligação. Tenta novamente.");
      setImageUrl(null);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function retryUpload() {
    if (!fileRef.current) return;
    fileRef.current.click();
  }

  function removeImage() {
    setImagePreview(null);
    setImageUrl(null);
    setUploadErr("");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handlePost() {
    if (!text.trim() || !userEmail || posting || uploading) return;
    setPosting(true);
    try {
      const res = await fetch("/api/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content:   text.trim(),
          tags:      fandom ? [fandom] : [],
          image_url: imageUrl ?? undefined,
        }),
      });
      if (res.ok) {
        setText("");
        setFandom("");
        removeImage();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2500);
        onPosted();
      }
    } catch {} finally {
      setPosting(false);
    }
  }

  const imageReady   = !!imageUrl && !uploading && !uploadErr;
  const uploadFailed = !!uploadErr && !uploading;
  const canPost      = !!text.trim() && !!userEmail && !posting && !uploading;

  return (
    <div className="border border-ink/15 bg-bone p-4 space-y-3">
      <div className="flex gap-3">
        {/* Avatar */}
        {authorAvatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={authorAvatarUrl}
            alt="O teu avatar"
            className="w-9 h-9 shrink-0 object-cover border border-ink/10"
          />
        ) : (
          <div
            className="w-9 h-9 shrink-0 grain flex items-center justify-center font-display font-black text-sm text-bone"
            style={{ background: authorBg }}
          >
            {authorInitials}
          </div>
        )}

        {/* Corpo */}
        <div className="flex-1 space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="O que está a acontecer no teu fandom?"
            rows={3}
            className="w-full bg-transparent border border-ink/15 focus:border-ink px-3 py-2 font-mono text-sm placeholder:text-ink/30 focus:outline-none transition-colors resize-none"
          />

          {/* Preview da imagem */}
          {imagePreview && (
            <div className="relative w-fit">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Preview"
                className={`max-h-52 max-w-full object-contain bg-ink/5 border transition-opacity ${
                  uploading
                    ? "opacity-40 border-ink/10"
                    : uploadFailed
                    ? "opacity-50 border-coral/40"
                    : "opacity-100 border-ink/15"
                }`}
              />

              {/* Overlay de estado */}
              {uploading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <Loader2 size={22} className="text-ink animate-spin" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-ink/70">
                    A carregar...
                  </span>
                </div>
              )}
              {imageReady && (
                <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 bg-emerald-600/90 px-1.5 py-0.5">
                  <Check size={9} strokeWidth={3} className="text-bone" />
                  <span className="font-mono text-[8px] text-bone uppercase tracking-[0.1em]">Carregado</span>
                </div>
              )}

              {/* Botão remover */}
              <button
                onClick={removeImage}
                title="Remover imagem"
                className="absolute top-1.5 right-1.5 bg-ink/80 hover:bg-ink text-bone p-1 transition-colors"
              >
                <X size={11} strokeWidth={2.5} />
              </button>
            </div>
          )}

          {/* Erro de upload */}
          {uploadFailed && (
            <div className="flex items-center gap-3 border border-coral/30 bg-coral/5 px-3 py-2">
              <span className="font-mono text-[10px] text-coral flex-1">{uploadErr}</span>
              <button
                onClick={retryUpload}
                className="font-mono text-[9px] uppercase tracking-[0.15em] text-coral underline hover:no-underline shrink-0"
              >
                Tentar novamente
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Input de ficheiro escondido */}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleImagePick}
      />

      {/* Barra de acções */}
      <div className="flex flex-wrap items-center justify-between gap-2 pl-0 sm:pl-12">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { removeImage(); fileRef.current?.click(); }}
            className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] border px-2 py-1 transition-colors ${
              uploading
                ? "border-ink/10 text-ink/30 cursor-wait"
                : imageReady
                ? "border-emerald-400/50 text-emerald-700 hover:border-emerald-400"
                : uploadFailed
                ? "border-coral/40 text-coral hover:border-coral"
                : "border-ink/10 text-ink/40 hover:text-ink hover:border-ink"
            }`}
          >
            {uploading
              ? <><Loader2 size={11} className="animate-spin" /> A carregar</>
              : imageReady
              ? <><Check size={11} strokeWidth={2.5} /> Imagem</>
              : uploadFailed
              ? <><ImageIcon size={11} /> Substituir</>
              : <><ImageIcon size={11} /> Imagem</>}
          </button>

          <select
            value={fandom}
            onChange={(e) => setFandom(e.target.value)}
            className="bg-bone border border-ink/10 hover:border-ink px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50 focus:outline-none transition-colors"
          >
            <option value="">Fandom</option>
            {FANDOM_FILTERS.slice(1).map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <button
          onClick={handlePost}
          disabled={!canPost}
          className={`flex items-center gap-2 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] border transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
            success
              ? "bg-emerald-100 border-emerald-400 text-emerald-700"
              : "bg-ink text-bone border-ink hover:bg-ink/80"
          }`}
        >
          {success
            ? <><Check size={11} strokeWidth={2.5} /> Publicado</>
            : posting
            ? <><Loader2 size={11} className="animate-spin" /> A publicar...</>
            : <><Send size={11} /> Publicar</>}
        </button>
      </div>
    </div>
  );
}

/* ── Página principal ────────────────────────────────── */
type Tab = "geral" | "seguindo" | "anuncios";

type Member = { email: string; name: string; username: string; fandom: string; initials: string; bg: string };

export default function FeedPage() {
  const { user } = useAuth();
  const { isGuest, requestLogin } = useGuestMode();

  const [posts, setPosts]             = useState<FeedPost[]>([]);
  const [loading, setLoading]         = useState(false);
  const [hasMore, setHasMore]         = useState(true);
  const [tab, setTab]                 = useState<Tab>("geral");
  const [fandomFilter, setFandomFilter] = useState("Todos");
  const [nextEvent, setNextEvent]     = useState<EventItem | null>(null);
  const [activeMembers, setActiveMembers] = useState<Member[]>([]);
  const [followingEmails, setFollowingEmails] = useState<Set<string>>(new Set());
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [notifications, setNotifications] = useState<NotifItem[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [trending, setTrending] = useState<{ tag: string; count: number }[]>([]);

  const pageRef    = useRef(1);
  const loadingRef = useRef(false);

  const loadPage = useCallback(async (pageNum: number, replace = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const res = await fetch(`/api/feed?page=${pageNum}&limit=10&tab=${tab}`);
      if (!res.ok) return;
      const { posts: newPosts, hasMore: more } = await res.json();
      setPosts((prev) => replace ? newPosts : [...prev, ...newPosts]);
      setHasMore(more);
      pageRef.current = pageNum;
    } catch {} finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [tab]);

  // Reset + reload quando o tab muda
  useEffect(() => {
    pageRef.current = 1;
    setHasMore(true);
    setPosts([]);
    loadPage(1, true);
  }, [loadPage]);

  // Dados da sidebar
  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.ok ? r.json() : [])
      .then((d) => { if (Array.isArray(d) && d.length > 0) setNextEvent(d[0]); })
      .catch(() => {});
    fetch("/api/stats/members")
      .then((r) => r.ok ? r.json() : [])
      .then((d) => { if (Array.isArray(d)) setActiveMembers(d); })
      .catch(() => {});
    fetch("/api/feed/trending")
      .then((r) => r.ok ? r.json() : [])
      .then((d) => { if (Array.isArray(d)) setTrending(d); })
      .catch(() => {});
  }, []);

  // Follows + notificações (só com utilizador autenticado)
  useEffect(() => {
    if (!user) return;
    fetch("/api/following")
      .then((r) => r.ok ? r.json() : [])
      .then((emails) => { if (Array.isArray(emails)) setFollowingEmails(new Set(emails)); })
      .catch(() => {});
    fetch("/api/notifications")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => {
        if (Array.isArray(data)) {
          setUnreadNotifs(data.filter((n: { read: boolean }) => !n.read).length);
        }
      })
      .catch(() => {});
  }, [user]);

  const loadMore = useCallback(() => {
    loadPage(pageRef.current + 1);
  }, [loadPage]);

  const sentinelRef = useInfiniteScroll({
    enabled: !loading,
    hasMore,
    isLoading: loading,
    onLoadMore: loadMore,
  });

  function handleFollowUpdate(email: string, nowFollowing: boolean) {
    setFollowingEmails((prev) => {
      const next = new Set(prev);
      if (nowFollowing) next.add(email);
      else next.delete(email);
      return next;
    });
  }

  const filtered = fandomFilter === "Todos"
    ? posts
    : posts.filter((p) => p.author.fandom === fandomFilter || p.tags?.includes(fandomFilter));

  const authorInitials = user
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")
    : "KM";
  const authorBg = user?.fandoms?.[0]
    ? (FANDOM_BG[user.fandoms[0]] ?? "linear-gradient(135deg,#1c1c1c,#7B65C8)")
    : "linear-gradient(135deg,#1c1c1c,#7B65C8)";

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">

      {/* ── Coluna central ─────────────────────────────── */}
      <div className="space-y-4 min-w-0">

        {/* Header */}
        <div>
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink/50 mb-1">Conta / Feed</div>
          <div className="flex items-center justify-between">
            <h1 className="font-display font-bold text-3xl tracking-tight">
              Feed<span className="text-coral">.</span>
            </h1>
            {!isGuest && (
              <button
                onClick={() => {
                  const opening = !showNotifPanel;
                  setShowNotifPanel(opening);
                  if (opening) {
                    setLoadingNotifs(true);
                    setNotifications([]);
                    fetch("/api/notifications")
                      .then((r) => r.ok ? r.json() : [])
                      .then((d) => { if (Array.isArray(d)) setNotifications(d); })
                      .catch(() => {})
                      .finally(() => setLoadingNotifs(false));
                  } else {
                    if (unreadNotifs > 0) {
                      setUnreadNotifs(0);
                      fetch("/api/notifications", { method: "PATCH" }).catch(() => {});
                    }
                  }
                }}
                className={`relative flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors ${showNotifPanel ? "text-coral" : unreadNotifs > 0 ? "text-coral hover:text-coral/70" : "text-ink/40 hover:text-ink"}`}
              >
                <Bell size={14} strokeWidth={2} />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-coral text-bone font-mono text-[8px] rounded-full flex items-center justify-center leading-none">
                    {unreadNotifs > 9 ? "9+" : unreadNotifs}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Painel de notificações */}
          {showNotifPanel && (
            <div className="mt-3 border border-ink/15 bg-bone">
              <div className="flex items-center justify-between px-4 py-3 border-b border-ink/10">
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/60">Notificações</span>
                <button
                  onClick={() => {
                    setShowNotifPanel(false);
                    if (unreadNotifs > 0) {
                      setUnreadNotifs(0);
                      fetch("/api/notifications", { method: "PATCH" }).catch(() => {});
                    }
                  }}
                  className="text-ink/40 hover:text-ink"
                >
                  <X size={14} />
                </button>
              </div>
              {loadingNotifs ? (
                <div className="flex items-center justify-center gap-2 px-4 py-8 font-mono text-[10px] text-ink/30">
                  <Loader2 size={12} className="animate-spin" /> A carregar…
                </div>
              ) : notifications.length === 0 ? (
                <div className="px-4 py-8 text-center font-mono text-xs text-ink/30 tracking-[0.15em] uppercase">
                  Sem notificações
                </div>
              ) : (
                <ul className="divide-y divide-ink/5 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <li key={n.id} className={`px-4 py-3 flex items-start gap-3 ${n.read ? "opacity-60" : ""}`}>
                      <div className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${n.read ? "bg-ink/20" : "bg-coral"}`} />
                      <div className="min-w-0">
                        <p className="font-mono text-[11px] text-ink leading-snug">
                          <span className="font-bold">{n.fromName}</span>
                          {n.type === "comment" && " comentou a tua publicação"}
                          {n.type === "like"    && " gostou da tua publicação"}
                          {n.type === "follow"  && " começou a seguir-te"}
                        </p>
                        <p className="font-mono text-[9px] text-ink/40 mt-0.5 tracking-[0.1em]">
                          {timeAgo(n.createdAt)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Compose */}
        {!isGuest && (
          <ComposeBox
            authorInitials={authorInitials}
            authorBg={authorBg}
            authorAvatarUrl={user?.image}
            userEmail={user?.email ?? null}
            onPosted={() => loadPage(1, true)}
          />
        )}

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
            const isLocked = isGuest && t !== "geral";
            return (
              <button
                key={t}
                onClick={() => {
                  if (isLocked) {
                    requestLogin({
                      title: "Acesso restrito",
                      message: "Entra na tua conta para ver os teus seguidores e anuncios.",
                    });
                    return;
                  }
                  setTab(t);
                }}
                className={`px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] border-b-2 -mb-px transition-all ${
                  tab === t ? "border-coral text-ink" : "border-transparent text-ink/40 hover:text-ink"
                }`}
              >
                {labels[t]}
                {isLocked && <Lock size={10} className="inline-block ml-1.5 text-coral" strokeWidth={2} />}
              </button>
            );
          })}
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {filtered.length === 0 && !loading ? (
            <div className="py-16 text-center font-mono text-xs tracking-[0.2em] uppercase text-ink/30">
              {tab === "seguindo"
                ? "Ainda não segues ninguém — segue alguém para ver os seus posts aqui."
                : "Nenhum post encontrado."}
            </div>
          ) : (
            filtered.map((post, i) => (
              <div
                key={post.id}
                className="animate-fade-in"
                style={{ animationDelay: `${Math.min(i, 5) * 50}ms` }}
              >
                <PostCard
                  post={post}
                  userEmail={user?.email ?? null}
                  isFollowing={followingEmails.has(post.author.email)}
                  onFollowToggle={handleFollowUpdate}
                  onDeleted={(id) => setPosts((prev) => prev.filter((p) => p.id !== id))}
                />
              </div>
            ))
          )}

          {/* Sentinel para scroll infinito */}
          <div ref={sentinelRef} className="h-1" />

          {loading && (
            <div className="py-6 text-center font-mono text-[10px] tracking-[0.2em] uppercase text-ink/30">
              A carregar...
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <div className="py-6 text-center font-mono text-[10px] tracking-[0.2em] uppercase text-ink/20">
              · Chegaste ao fim ·
            </div>
          )}
        </div>
      </div>

      {/* ── Painel lateral ─────────────────────────────── */}
      <aside className="hidden xl:flex flex-col gap-5 self-start sticky top-24">

        {/* Trending */}
        {trending.length > 0 && (
          <div className="border border-ink/10 p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={13} className="text-coral" strokeWidth={2} />
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/60">Em destaque</span>
            </div>
            <div className="space-y-2">
              {trending.map((t, i) => (
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
        )}

        {/* Membros recentes */}
        {activeMembers.length > 0 && (
          <div className="border border-ink/10 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Users size={13} className="text-coral" strokeWidth={2} />
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/60">Membros recentes</span>
            </div>
            <div className="space-y-3">
              {activeMembers.map((m) => (
                <MemberRow
                  key={m.email}
                  member={m}
                  isFollowing={followingEmails.has(m.email)}
                  currentUserEmail={user?.email ?? null}
                  onToggle={handleFollowUpdate}
                />
              ))}
            </div>
            <Link
              href="/comunidade"
              className="block mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-coral hover:underline"
            >
              Ver comunidade →
            </Link>
          </div>
        )}

        {/* Próximo evento */}
        {nextEvent && (
          <div className="border border-coral/30 bg-coral/5 p-4">
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-coral mb-2">Próximo evento</div>
            <div className="font-display font-bold text-sm leading-tight mb-1">{nextEvent.title}</div>
            <div className="font-mono text-[10px] text-ink/50 mb-3">
              {nextEvent.date.split("-").reverse().join("/")} · {nextEvent.location} · {nextEvent.city}
            </div>
            <Link href={`/eventos/${nextEvent.slug}`} className="btn-brutal text-xs py-2">
              <Calendar size={11} /> Ver evento
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
