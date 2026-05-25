"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Calendar, Users, Rss, UserPlus, UserCheck,
  Loader2, ArrowLeft, Heart, MessageCircle, Settings, X,
} from "lucide-react";
import { useAuth } from "@/contexts/auth";

const FANDOM_COLORS: Record<string, string> = {
  ARMY:    "#7a2c5e", BLINK:   "#ff3d68", STAY:    "#1c1c1c",
  ONCE:    "#ff5a82", MOA:     "#3a5cff", "EXO-L": "#0a0a0a",
  CARAT:   "#ffd23f", ATINY:   "#1a8c6e", Bunnies: "#1a8c6e",
  DIVE:    "#c0185e", ReVeluv: "#b52222", STAR1:   "#2255cc",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "Agora";
  if (m < 60) return `${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}
function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

interface Connection {
  name: string; username: string; city: string;
  avatarUrl: string | null; initials: string; avatarBg: string; fandom: string;
}

interface ProfileData {
  profile: {
    name: string; username: string; city: string; bio: string;
    fandoms: string[]; avatarUrl: string | null; joinedAt: string; email: string;
  };
  stats: { followers: number; following: number; posts: number };
  isFollowing: boolean;
  isOwnProfile: boolean;
  recentPosts: {
    id: string; content: string; image_url: string | null;
    reactions: number; comments: number; tags: string[];
    published_at: string; type: string;
  }[];
}

/* ── Modal de Seguidores/A-seguir ──────────────────────── */
function ConnectionsModal({
  title, username, type, onClose,
}: {
  title: string;
  username: string;
  type: "followers" | "following";
  onClose: () => void;
}) {
  const [list, setList]       = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/perfil/${username}/connections?type=${type}`)
      .then((r) => r.ok ? r.json() : [])
      .then(setList)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [username, type]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full sm:max-w-md bg-bone border border-ink/15 max-h-[80vh] sm:max-h-[70vh] flex flex-col shadow-xl">
        {/* Cabeçalho do modal */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink/10">
          <div className="font-display font-bold text-lg">{title}</div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border border-ink/15 hover:bg-ink hover:text-bone transition-colors"
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        {/* Lista */}
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 font-mono text-[10px] text-ink/30">
              <Loader2 size={14} className="animate-spin" /> A carregar…
            </div>
          ) : list.length === 0 ? (
            <div className="py-12 text-center font-mono text-xs tracking-[0.2em] uppercase text-ink/25">
              {type === "followers" ? "Ainda sem seguidores." : "Ainda não segue ninguém."}
            </div>
          ) : (
            <div className="divide-y divide-ink/[0.07]">
              {list.map((c) => (
                <Link
                  key={c.username}
                  href={`/perfil/${c.username.replace("@", "")}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-ink/5 transition-colors"
                >
                  {c.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.avatarUrl} alt={c.name} className="w-10 h-10 object-cover shrink-0 border border-ink/10" />
                  ) : (
                    <div
                      className="w-10 h-10 shrink-0 grain flex items-center justify-center font-display font-black text-sm text-bone"
                      style={{ background: c.avatarBg }}
                    >
                      {c.initials}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-semibold text-sm leading-tight truncate">{c.name}</div>
                    <div className="font-mono text-[9px] text-ink/40 truncate">{c.username}</div>
                  </div>
                  {c.fandom && (
                    <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-ink/30 bg-ink/5 px-1.5 py-px shrink-0">
                      {c.fandom}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Página principal ────────────────────────────────────── */
export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [data, setData]             = useState<ProfileData | null>(null);
  const [loading, setLoading]       = useState(true);
  const [notFound, setNotFound]     = useState(false);
  const [following, setFollowing]   = useState(false);
  const [followBusy, setFollowBusy] = useState(false);
  const [modal, setModal]           = useState<"followers" | "following" | null>(null);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    fetch(`/api/perfil/${username}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((d: ProfileData | null) => {
        if (d) { setData(d); setFollowing(d.isFollowing); }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username]);

  async function handleFollow() {
    if (!user || !data || followBusy) return;
    const prev = following;
    setFollowing((v) => !v);
    setFollowBusy(true);
    try {
      const res = await fetch("/api/following", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.profile.email }),
      });
      if (res.ok) {
        const { following: f } = await res.json();
        setFollowing(f);
        setData((d) => d ? { ...d, stats: { ...d.stats, followers: d.stats.followers + (f ? 1 : -1) } } : d);
      } else { setFollowing(prev); }
    } catch { setFollowing(prev); }
    finally { setFollowBusy(false); }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-ink/30" />
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <div className="font-display font-black text-6xl text-ink/10">404</div>
        <p className="font-mono text-sm text-ink/40">Perfil não encontrado.</p>
        <button onClick={() => router.back()} className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-coral hover:underline">
          <ArrowLeft size={12} /> Voltar
        </button>
      </div>
    );
  }

  const { profile, stats, isOwnProfile, recentPosts } = data;
  const initials = profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const joinYear  = profile.joinedAt ? new Date(profile.joinedAt).getFullYear() : null;

  return (
    <div className="min-h-screen bg-bone pt-16 lg:pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 lg:py-14">

        {/* Voltar */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40 hover:text-ink transition-colors mb-8"
        >
          <ArrowLeft size={12} strokeWidth={2} /> Voltar
        </button>

        {/* Cabeçalho do perfil */}
        <div className="border border-ink/10 p-6 sm:p-8 bg-bone mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

            {/* Avatar */}
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatarUrl} alt={profile.name} className="w-20 h-20 sm:w-24 sm:h-24 object-cover shrink-0 border border-ink/10" />
            ) : (
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center font-display font-black text-3xl text-bone"
                style={{ background: "linear-gradient(135deg,#1c1c1c,#7B65C8)" }}
              >
                {initials}
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start gap-3 justify-between">
                <div>
                  <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight leading-tight">{profile.name}</h1>
                  <div className="font-mono text-xs text-ink/40 mt-0.5">{profile.username}</div>
                </div>
                {isOwnProfile ? (
                  <Link href="/conta/perfil" className="flex items-center gap-2 px-4 py-2 border border-ink font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-ink hover:text-bone transition-colors">
                    <Settings size={12} /> Editar
                  </Link>
                ) : user ? (
                  <button
                    onClick={handleFollow}
                    disabled={followBusy}
                    className={`flex items-center gap-2 px-4 py-2 border font-mono text-[10px] uppercase tracking-[0.2em] transition-colors disabled:opacity-50 ${
                      following
                        ? "border-coral text-coral hover:bg-coral/5"
                        : "border-ink bg-ink text-bone hover:bg-ink/80"
                    }`}
                  >
                    {following ? <><UserCheck size={12} /> A seguir</> : <><UserPlus size={12} /> Seguir</>}
                  </button>
                ) : (
                  <Link href="/entrar" className="flex items-center gap-2 px-4 py-2 border border-ink bg-ink text-bone font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-ink/80 transition-colors">
                    <UserPlus size={12} /> Seguir
                  </Link>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-3">
                {profile.city && (
                  <span className="flex items-center gap-1.5 font-mono text-[10px] text-ink/40">
                    <MapPin size={10} strokeWidth={2} /> {profile.city}
                  </span>
                )}
                {joinYear && (
                  <span className="flex items-center gap-1.5 font-mono text-[10px] text-ink/40">
                    <Calendar size={10} strokeWidth={2} /> Membro desde {joinYear}
                  </span>
                )}
              </div>

              {profile.bio && (
                <p className="font-mono text-sm text-ink/60 mt-3 leading-relaxed">{profile.bio}</p>
              )}
            </div>
          </div>

          {profile.fandoms.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-ink/10">
              {profile.fandoms.map((f) => (
                <span key={f} className="px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-bone" style={{ background: FANDOM_COLORS[f] ?? "#1c1c1c" }}>
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Stats — seguidores e a-seguir são botões clicáveis */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <button
            onClick={() => setModal("followers")}
            className="border border-ink/10 p-4 text-center bg-bone hover:border-ink/30 hover:bg-ink/[0.02] transition-colors group"
          >
            <div className="font-display font-black text-2xl group-hover:text-coral transition-colors">{fmt(stats.followers)}</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-ink/40 mt-1 flex items-center justify-center gap-1">
              <Users size={10} /> Seguidores
            </div>
          </button>
          <button
            onClick={() => setModal("following")}
            className="border border-ink/10 p-4 text-center bg-bone hover:border-ink/30 hover:bg-ink/[0.02] transition-colors group"
          >
            <div className="font-display font-black text-2xl group-hover:text-coral transition-colors">{fmt(stats.following)}</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-ink/40 mt-1 flex items-center justify-center gap-1">
              <Users size={10} /> A seguir
            </div>
          </button>
          <div className="border border-ink/10 p-4 text-center bg-bone">
            <div className="font-display font-black text-2xl">{fmt(stats.posts)}</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-ink/40 mt-1 flex items-center justify-center gap-1">
              <Rss size={10} /> Posts
            </div>
          </div>
        </div>

        {/* Posts recentes */}
        {recentPosts.length > 0 && (
          <div>
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink/40 mb-4">Posts recentes</div>
            <div className="space-y-3">
              {recentPosts.map((p) => (
                <div key={p.id} className="border border-ink/10 bg-bone p-4 hover:border-ink/25 transition-colors">
                  {p.content && (
                    <p className="font-mono text-sm text-ink/70 leading-relaxed whitespace-pre-wrap line-clamp-3 mb-2">{p.content}</p>
                  )}
                  {p.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image_url} alt="Post" className="w-full max-h-48 object-cover mb-2" />
                  )}
                  {p.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {p.tags.map((t) => (
                        <span key={t} className="font-mono text-[9px] uppercase tracking-[0.15em] text-ink/25 bg-ink/5 px-2 py-0.5">#{t}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-mono text-[10px] text-ink/30"><Heart size={10} strokeWidth={2} /> {p.reactions}</span>
                      <span className="flex items-center gap-1 font-mono text-[10px] text-ink/30"><MessageCircle size={10} strokeWidth={2} /> {p.comments}</span>
                    </div>
                    <span className="font-mono text-[9px] text-ink/25">{timeAgo(p.published_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {recentPosts.length === 0 && (
          <div className="py-12 text-center font-mono text-xs tracking-[0.2em] uppercase text-ink/20">Ainda sem posts públicos.</div>
        )}

      </div>

      {/* Modal */}
      {modal && (
        <ConnectionsModal
          title={modal === "followers" ? "Seguidores" : "A seguir"}
          username={username}
          type={modal}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
