"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { FeedPost } from "@/types";
import {
  Heart, MessageCircle, Share2, Check, Newspaper, Calendar,
  Mic2, Trophy, ArrowUpRight, Send, Loader2, ChevronDown, Trash2,
  Flag, UserPlus, UserCheck, Repeat2,
} from "lucide-react";
import { useGuestMode } from "@/components/layout/GuestModeProvider";

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

const TYPE_BADGE: Record<string, { label: string; cls: string; icon?: React.ReactNode }> = {
  news:      { label: "Notícia",  cls: "text-coral bg-coral/10",        icon: <Newspaper size={9} /> },
  event:     { label: "Evento",   cls: "text-blue-600 bg-blue-50",       icon: <Calendar size={9} /> },
  talent:    { label: "Talento",  cls: "text-emerald-700 bg-emerald-50", icon: <Mic2 size={9} /> },
  milestone: { label: "Marco",    cls: "text-amber-700 bg-amber-50",     icon: <Trophy size={9} /> },
};

/* ── tipos ───────────────────────────────────────────── */
interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: { name: string; username: string; initials: string; avatarBg: string };
}

/* ── PostCard ────────────────────────────────────────── */
export function PostCard({
  post, userEmail, isFollowing, onFollowToggle, onDeleted,
}: {
  post: FeedPost;
  userEmail: string | null;
  isFollowing: boolean;
  onFollowToggle: (email: string, nowFollowing: boolean) => void;
  onDeleted: (id: string) => void;
}) {
  const { isGuest, requestLogin } = useGuestMode();

  const requireLogin = useCallback((detail?: { title?: string; message?: string; returnTo?: string }) => {
    if (!isGuest) return true;

    requestLogin(detail);
    return false;
  }, [isGuest, requestLogin]);

  const [liked,        setLiked]        = useState(post.likedByMe ?? false);
  const [likeCount,    setLikeCount]    = useState(post.reactions[0]?.count ?? 0);
  const [likeBusy,     setLikeBusy]     = useState(false);
  const [shareState,   setShareState]   = useState<"idle" | "copied" | "shared">("idle");
  const [following,    setFollowing]    = useState(isFollowing);
  const [followBusy,   setFollowBusy]   = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting,        setDeleting]        = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason,    setReportReason]    = useState("Spam ou publicidade");
  const [reportDetails,   setReportDetails]   = useState("");
  const [reporting,       setReporting]       = useState(false);
  const [reported,        setReported]        = useState(false);
  const [reportError,     setReportError]     = useState("");

  // Sincroniza quando o pai actualiza followingEmails
  useEffect(() => { setFollowing(isFollowing); }, [isFollowing]);

  const [showComments,   setShowComments]   = useState(false);
  const [comments,       setComments]       = useState<Comment[]>([]);
  const [commentCount,   setCommentCount]   = useState(post.comments);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText,    setCommentText]    = useState("");
  const [postingComment, setPostingComment] = useState(false);

  // Repost state
  const [showRepostModal, setShowRepostModal] = useState(false);
  const [repostText,      setRepostText]      = useState("");
  const [reposting,       setReposting]       = useState(false);
  const [reposted,        setReposted]        = useState(false);
  const [shareCount,      setShareCount]      = useState(post.shares ?? 0);

  const isRepost = !!post.repostOfId;
  const repostTarget = post.repostOf ?? null;

  async function handleLike() {
    if (!requireLogin({
      title: "Like protegido",
      message: "Entra na tua conta para guardar gostos e interagir com publicacoes.",
    }) || likeBusy) return;
    const prev = { liked, count: likeCount };
    setLiked((v) => !v);
    setLikeCount((n) => (liked ? n - 1 : n + 1));
    setLikeBusy(true);
    try {
      const res = await fetch(`/api/feed/${post.id}/like`, { method: "POST" });
      if (res.ok) {
        const { liked: l, count: c } = await res.json();
        setLiked(l); setLikeCount(c);
      } else {
        setLiked(prev.liked); setLikeCount(prev.count);
      }
    } catch {
      setLiked(prev.liked); setLikeCount(prev.count);
    } finally {
      setLikeBusy(false);
    }
  }

  async function handleShare() {
    const url = `${window.location.origin}/post/${post.id}`;
    const text = post.content ? `${post.content.slice(0, 120)}…` : "Partilha do KPOP.MZ";

    // Web Share API (funciona no mobile/HTTPS)
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "KPOP.MZ", text, url });
        setShareState("shared");
        setTimeout(() => setShareState("idle"), 2500);
        return;
      } catch { /* utilizador cancelou — não faz nada */ }
    }

    // Fallback: copiar para clipboard (compatível com HTTP/localhost)
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback legacy para browsers sem Clipboard API
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.style.cssText = "position:fixed;opacity:0;pointer-events:none";
        document.body.appendChild(ta);
        ta.focus(); ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setShareState("copied");
      setTimeout(() => setShareState("idle"), 2500);
    } catch {}
  }

  async function handleFollow() {
    if (!requireLogin({
      title: "Seguir requer login",
      message: "Entra na tua conta para seguir membros e montar o teu feed.",
    }) || followBusy || userEmail === post.author.email) return;
    const prev = following;
    setFollowing((v) => !v);
    setFollowBusy(true);
    try {
      const res = await fetch("/api/following", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: post.author.email }),
      });
      if (res.ok) {
        const { following: f } = await res.json();
        setFollowing(f);
        onFollowToggle(post.author.email, f);
      } else {
        setFollowing(prev);
      }
    } catch {
      setFollowing(prev);
    } finally {
      setFollowBusy(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/feed/${post.id}`, { method: "DELETE" });
      if (res.ok) { setShowDeleteModal(false); onDeleted(post.id); }
    } catch {} finally {
      setDeleting(false);
    }
  }

  async function handleReport(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!requireLogin({
      title: "Denuncia protegida",
      message: "Entra na tua conta para denunciar conteudo.",
    }) || reporting || reported) return;
    const details = reportDetails.trim();
    const reason = reportReason === "Outro"
      ? details
      : details
        ? `${reportReason}: ${details}`
        : reportReason;

    if (reason.trim().length < 3) {
      setReportError("Indica um motivo para a denuncia.");
      return;
    }

    setReporting(true);
    setReportError("");
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id, reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Nao foi possivel enviar a denuncia.");
      setReported(true);
      setShowReportModal(false);
      setReportDetails("");
    } catch (err) {
      setReportError(err instanceof Error ? err.message : "Nao foi possivel enviar a denuncia.");
    } finally {
      setReporting(false);
    }
  }

  async function toggleComments() {
    const opening = !showComments;
    setShowComments(opening);
    if (opening && comments.length === 0) {
      setLoadingComments(true);
      try {
        const res = await fetch(`/api/feed/${post.id}/comments`);
        if (res.ok) setComments(await res.json());
      } catch {} finally {
        setLoadingComments(false);
      }
    }
  }

  async function handlePostComment(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!requireLogin({
      title: "Comentario protegido",
      message: "Entra na tua conta para comentar publicacoes.",
    }) || !commentText.trim() || postingComment) return;
    setPostingComment(true);
    try {
      const res = await fetch(`/api/feed/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText.trim() }),
      });
      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [...prev, newComment]);
        setCommentCount((n) => n + 1);
        setCommentText("");
      }
    } catch {} finally {
      setPostingComment(false);
    }
  }

  async function handleRepost() {
    if (!requireLogin({
      title: "Repost protegido",
      message: "Entra na tua conta para repostar publicacoes.",
    }) || reposting || reposted) return;

    const targetPostId = repostTarget?.id ?? post.id;
    setReposting(true);
    try {
      const res = await fetch(`/api/feed/${targetPostId}/repost`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: repostText.trim() }),
      });
      if (res.ok) {
        setReposted(true);
        setShareCount((n) => n + 1);
        setShowRepostModal(false);
        setRepostText("");
      }
    } catch {} finally {
      setReposting(false);
    }
  }

  const badge = TYPE_BADGE[post.type];

  return (
    <article id={post.id} className="border border-ink/10 hover:border-ink/20 transition-colors bg-bone">
      {/* Label de repost */}
      {isRepost && (
        <div className="flex items-center gap-2 px-4 pt-3 pb-1">
          <Repeat2 size={12} className="text-ink/30" strokeWidth={2} />
          <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-ink/40">
            <span className="font-semibold text-ink/60">{post.author.name}</span> repostou
          </span>
        </div>
      )}
      <div className="flex items-start justify-between gap-3 p-4 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar: foto real ou iniciais */}
          <Link href={`/perfil/${post.author.username.replace("@", "")}`} className="shrink-0">
            {post.author.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.author.avatarUrl}
                alt={post.author.name}
                className="w-9 h-9 object-cover border border-ink/10"
              />
            ) : (
              <div
                className="w-9 h-9 grain flex items-center justify-center font-display font-black text-sm text-bone"
                style={{ background: post.author.avatarBg }}
              >
                {post.author.initials}
              </div>
            )}
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/perfil/${post.author.username.replace("@", "")}`}
                className="font-display font-semibold text-sm leading-tight hover:text-coral transition-colors"
              >
                {post.author.name}
              </Link>
              {/* Botão seguir (só para outros utilizadores) */}
              {userEmail !== post.author.email && (
                <button
                  onClick={handleFollow}
                  disabled={followBusy}
                  className={`flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.1em] px-1.5 py-px border transition-colors disabled:opacity-40 ${
                    following
                      ? "border-coral/40 text-coral"
                      : "border-ink/20 text-ink/40 hover:border-ink hover:text-ink"
                  }`}
                >
                  {following
                    ? <><UserCheck size={9} strokeWidth={2} /> A seguir</>
                    : <><UserPlus size={9} strokeWidth={2} /> Seguir</>}
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-[9px] tracking-[0.1em] text-ink/40">{post.author.username}</span>
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

      {post.content && (
        <p className="px-4 pb-3 font-mono text-sm text-ink/80 leading-relaxed whitespace-pre-wrap">{post.content}</p>
      )}

      {post.imageUrl && (
        <div className="mx-4 mb-3 bg-ink/5 border border-ink/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.imageUrl}
            alt="Imagem do post"
            className="w-full block max-h-[30rem] lg:max-h-[27.5rem] object-contain"
          />
        </div>
      )}
      {!post.imageUrl && post.image && (
        <div className="mx-4 mb-3 h-44 grain" style={{ background: post.image.bg }} aria-label={post.image.alt} />
      )}

      {post.link && (
        <div className="px-4 pb-3">
          <Link href={post.link.href} className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-coral hover:underline">
            {post.link.label} <ArrowUpRight size={11} />
          </Link>
        </div>
      )}

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {post.tags.map((tag) => (
            <span key={tag} className="font-mono text-[9px] tracking-[0.15em] uppercase text-ink/30 bg-ink/5 px-2 py-0.5">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Preview do post original (quando é repost) */}
      {repostTarget && (
        <div className="mx-4 mb-3 border border-ink/10 bg-ink/[0.02] p-3">
          <div className="flex items-center gap-2 mb-2">
            <Link href={`/perfil/${repostTarget.author.username.replace("@", "")}`} className="shrink-0">
              {repostTarget.author.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={repostTarget.author.avatarUrl}
                  alt={repostTarget.author.name}
                  className="w-6 h-6 object-cover border border-ink/10"
                />
              ) : (
                <div
                  className="w-6 h-6 grain flex items-center justify-center font-display font-black text-[8px] text-bone"
                  style={{ background: repostTarget.author.avatarBg }}
                >
                  {repostTarget.author.initials}
                </div>
              )}
            </Link>
            <Link
              href={`/perfil/${repostTarget.author.username.replace("@", "")}`}
              className="font-display font-semibold text-xs hover:text-coral transition-colors truncate"
            >
              {repostTarget.author.name}
            </Link>
            <span className="font-mono text-[8px] text-ink/30">{timeAgo(repostTarget.publishedAt)}</span>
          </div>
          {repostTarget.content && (
            <p className="font-mono text-xs text-ink/60 leading-relaxed whitespace-pre-wrap line-clamp-3">
              {repostTarget.content}
            </p>
          )}
          {repostTarget.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={repostTarget.imageUrl}
              alt=""
              className="mt-2 max-h-32 w-full object-cover border border-ink/5"
            />
          )}
          <Link
            href={`/post/${repostTarget.id}`}
            className="inline-flex items-center gap-1 mt-2 font-mono text-[9px] uppercase tracking-[0.15em] text-coral hover:underline"
          >
            Ver publicação original <ArrowUpRight size={9} />
          </Link>
        </div>
      )}

      {/* Barra de acções */}
      <div className="flex items-center justify-between px-3 py-2.5 border-t border-ink/[0.08]">
        {/* Esquerda: like + comentários */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={handleLike}
            disabled={likeBusy}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-xs transition-colors border disabled:cursor-default ${
              liked
                ? "border-coral text-coral bg-coral/5"
                : "border-transparent text-ink/40 hover:text-coral hover:border-coral/30"
            }`}
          >
            <Heart size={13} strokeWidth={2} fill={liked ? "currentColor" : "none"} />
            {fmt(likeCount)}
          </button>
          <button
            onClick={toggleComments}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-xs transition-colors border ${
              showComments
                ? "border-ink/20 text-ink"
                : "border-transparent text-ink/40 hover:text-ink hover:border-ink/10"
            }`}
          >
            <MessageCircle size={13} strokeWidth={2} />
            {commentCount}
            <ChevronDown size={10} className={`transition-transform ${showComments ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Direita: repost + partilhar + denunciar/apagar */}
        <div className="flex items-center gap-0.5">
          {/* Repost — só para posts de outros utilizadores e que não são já um repost próprio */}
          {userEmail && userEmail !== post.author.email && !reposted && (
            <button
              onClick={() => setShowRepostModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] border border-transparent text-ink/30 hover:text-emerald-600 hover:border-emerald-300/30 transition-colors"
            >
              <Repeat2 size={12} strokeWidth={2} />
              <span className="hidden sm:inline">Repostar</span>
            </button>
          )}
          {reposted && (
            <span className="flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] border border-emerald-400/40 text-emerald-700 bg-emerald-50">
              <Check size={11} strokeWidth={2.5} />
              <span className="hidden sm:inline">Repostado</span>
            </span>
          )}
          {shareCount > 0 && (
            <span className="flex items-center gap-1 px-1.5 py-1.5 font-mono text-[10px] text-ink/30">
              <Repeat2 size={10} />
              {fmt(shareCount)}
            </span>
          )}
          <button
            onClick={handleShare}
            title="Partilhar"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] border transition-colors ${
              shareState !== "idle"
                ? "border-emerald-400/40 text-emerald-700 bg-emerald-50"
                : "border-transparent text-ink/30 hover:text-ink hover:border-ink/10"
            }`}
          >
            {shareState !== "idle"
              ? <Check size={12} strokeWidth={2.5} />
              : <Share2 size={12} strokeWidth={2} />}
            <span className="hidden sm:inline">
              {shareState === "shared" ? "Partilhado" : shareState === "copied" ? "Copiado" : "Partilhar"}
            </span>
          </button>

          {userEmail !== post.author.email && (
            <button
              onClick={() => setShowReportModal(true)}
              disabled={reported}
              title={reported ? "Denuncia enviada" : "Denunciar post"}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] border transition-colors disabled:cursor-default ${
                reported
                  ? "border-amber-300/50 text-amber-700 bg-amber-50"
                  : "border-transparent text-ink/30 hover:text-coral hover:border-coral/20"
              }`}
            >
              {reported ? <Check size={12} strokeWidth={2.5} /> : <Flag size={12} strokeWidth={2} />}
              <span className="hidden sm:inline">{reported ? "Denunciado" : "Denunciar"}</span>
            </button>
          )}

          {/* Apagar — só o autor, abre modal */}
          {userEmail && userEmail === post.author.email && (
            <button
              onClick={() => setShowDeleteModal(true)}
              title="Apagar post"
              className="flex items-center px-2.5 py-1.5 border border-transparent text-ink/20 hover:text-coral hover:border-coral/20 transition-colors"
            >
              <Trash2 size={13} strokeWidth={1.75} />
            </button>
          )}
        </div>
      </div>

      {showReportModal && (
        <div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowReportModal(false); }}
        >
          <form onSubmit={handleReport} className="w-full sm:max-w-md bg-bone border border-ink/15 shadow-xl mb-16 sm:mb-0">
            <div className="px-6 py-5 border-b border-ink/10">
              <div className="font-display font-bold text-lg mb-1">Denunciar publicacao</div>
              <p className="font-mono text-xs text-ink/50 leading-relaxed">
                A equipa admin vai rever esta denuncia antes de tomar uma acao.
              </p>
            </div>
            <div className="px-6 py-5 space-y-4">
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">
                  Motivo
                </span>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="mt-2 w-full border border-ink/15 bg-transparent px-3 py-2 font-mono text-xs focus:outline-none focus:border-ink"
                >
                  <option>Spam ou publicidade</option>
                  <option>Assedio ou ataque pessoal</option>
                  <option>Conteudo ofensivo</option>
                  <option>Informacao falsa</option>
                  <option>Outro</option>
                </select>
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">
                  Detalhes
                </span>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  maxLength={180}
                  rows={3}
                  placeholder="Opcional, mas ajuda a moderacao."
                  className="mt-2 w-full resize-none border border-ink/15 bg-transparent px-3 py-2 font-mono text-xs focus:outline-none focus:border-ink"
                />
              </label>
              {reportError && (
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-coral">
                  {reportError}
                </p>
              )}
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-ink/10">
              <button
                type="submit"
                disabled={reporting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-coral text-bone border border-coral font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-coral/80 transition-colors disabled:opacity-50"
              >
                {reporting
                  ? <><Loader2 size={11} className="animate-spin" /> A enviar</>
                  : <><Flag size={11} /> Enviar denuncia</>}
              </button>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                disabled={reporting}
                className="flex-1 py-2.5 border border-ink/20 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60 hover:border-ink hover:text-ink transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal de confirmação de apagar */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowDeleteModal(false); }}
        >
          {/* mb-16 em mobile garante que fica acima da barra de navegação inferior */}
          <div className="w-full sm:max-w-sm bg-bone border border-ink/15 shadow-xl mb-16 sm:mb-0">
            <div className="px-6 py-5 border-b border-ink/10">
              <div className="font-display font-bold text-lg mb-1">Apagar publicação?</div>
              <p className="font-mono text-xs text-ink/50 leading-relaxed">
                Esta acção não pode ser revertida. A publicação, os likes e os comentários serão eliminados permanentemente.
              </p>
            </div>
            <div className="flex gap-3 px-6 py-4">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-coral text-bone border border-coral font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-coral/80 transition-colors disabled:opacity-50"
              >
                {deleting
                  ? <><Loader2 size={11} className="animate-spin" /> A apagar…</>
                  : <><Trash2 size={11} /> Apagar</>}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 py-2.5 border border-ink/20 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60 hover:border-ink hover:text-ink transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de repost */}
      {showRepostModal && (
        <div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowRepostModal(false); }}
        >
          <div className="w-full sm:max-w-md bg-bone border border-ink/15 shadow-xl mb-16 sm:mb-0">
            <div className="px-6 py-5 border-b border-ink/10">
              <div className="font-display font-bold text-lg mb-1">Repostar</div>
              <p className="font-mono text-xs text-ink/50">
                Partilha esta publicação com os teus seguidores.
              </p>
            </div>
            <div className="px-6 py-5 space-y-4">
              <textarea
                value={repostText}
                onChange={(e) => setRepostText(e.target.value)}
                maxLength={240}
                rows={3}
                placeholder="Adiciona um comentário (opcional)…"
                className="w-full resize-none border border-ink/15 bg-transparent px-3 py-2 font-mono text-sm focus:outline-none focus:border-ink placeholder:text-ink/30"
              />
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-ink/30">
                  {repostText.length}/240
                </span>
              </div>
              {/* Preview do post a repostar */}
              <div className="border border-ink/10 bg-ink/[0.02] p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className="w-5 h-5 grain flex items-center justify-center font-display font-black text-[7px] text-bone"
                    style={{ background: post.author.avatarBg }}
                  >
                    {post.author.initials}
                  </div>
                  <span className="font-display font-semibold text-xs">{post.author.name}</span>
                </div>
                {post.content && (
                  <p className="font-mono text-[11px] text-ink/50 line-clamp-2">{post.content}</p>
                )}
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-ink/10">
              <button
                onClick={handleRepost}
                disabled={reposting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-bone border border-emerald-600 font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {reposting
                  ? <><Loader2 size={11} className="animate-spin" /> A repostar…</>
                  : <><Repeat2 size={11} /> Repostar</>}
              </button>
              <button
                onClick={() => setShowRepostModal(false)}
                disabled={reposting}
                className="flex-1 py-2.5 border border-ink/20 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60 hover:border-ink hover:text-ink transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Secção de comentários (expansível) */}
      {showComments && (
        <div className="border-t border-ink/[0.08] bg-ink/[0.02]">
          {/* Lista de comentários */}
          {loadingComments ? (
            <div className="flex items-center justify-center py-5 gap-2 font-mono text-[10px] text-ink/30">
              <Loader2 size={12} className="animate-spin" /> A carregar comentários…
            </div>
          ) : comments.length === 0 ? (
            <div className="px-4 py-4 font-mono text-[10px] tracking-[0.15em] uppercase text-ink/25 text-center">
              Sem comentários ainda — sê o primeiro!
            </div>
          ) : (
            <div className="divide-y divide-ink/[0.06]">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3 px-4 py-3">
                  <div
                    className="w-7 h-7 shrink-0 grain flex items-center justify-center font-display font-black text-[10px] text-bone"
                    style={{ background: c.author.avatarBg }}
                  >
                    {c.author.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="font-display font-semibold text-xs">{c.author.name}</span>
                      <span className="font-mono text-[9px] text-ink/30">{timeAgo(c.createdAt)}</span>
                    </div>
                    <p className="font-mono text-xs text-ink/70 leading-relaxed whitespace-pre-wrap">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Campo para novo comentário */}
          <form onSubmit={handlePostComment} className="flex gap-2 px-4 py-3 border-t border-ink/[0.08]">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onFocus={() => {
                if (isGuest) {
                  requestLogin({
                    title: "Comentario protegido",
                    message: "Entra na tua conta para comentar publicacoes.",
                  })
                }
              }}
              placeholder={isGuest ? "Entra para comentar…" : "Escreve um comentário…"}
              maxLength={500}
              className="flex-1 min-w-0 bg-transparent border border-ink/15 focus:border-ink px-3 py-2 font-mono text-xs placeholder:text-ink/25 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!commentText.trim() || postingComment}
              className="flex items-center gap-1.5 px-3 py-2 bg-ink text-bone font-mono text-[10px] uppercase tracking-[0.15em] border border-ink hover:bg-ink/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            >
              {postingComment
                ? <Loader2 size={10} className="animate-spin" />
                : <Send size={10} strokeWidth={2} />}
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
