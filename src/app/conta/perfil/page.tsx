"use client";

import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { Check, Users, Rss, Camera, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth";
import { useSession } from "next-auth/react";

interface Connection {
  name: string; username: string; avatarUrl: string | null;
  initials: string; avatarBg: string; fandom: string;
}

function ConnectionsModal({
  title, username, type, onClose,
}: {
  title: string; username: string; type: "followers" | "following"; onClose: () => void;
}) {
  const [list, setList]       = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/perfil/${username.replace("@", "")}/connections?type=${type}`)
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
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink/10">
          <div className="font-display font-bold text-lg">{title}</div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center border border-ink/15 hover:bg-ink hover:text-bone transition-colors">
            <X size={14} strokeWidth={2} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 font-mono text-[10px] text-ink/30">
              <Loader2 size={14} className="animate-spin" /> A carregar…
            </div>
          ) : list.length === 0 ? (
            <div className="py-12 text-center font-mono text-xs tracking-[0.2em] uppercase text-ink/25">
              {type === "followers" ? "Ainda sem seguidores." : "Ainda não segues ninguém."}
            </div>
          ) : (
            <div className="divide-y divide-ink/[0.07]">
              {list.map((c) => (
                <Link key={c.username} href={`/perfil/${c.username.replace("@", "")}`} onClick={onClose}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-ink/5 transition-colors">
                  {c.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.avatarUrl} alt={c.name} className="w-10 h-10 object-cover shrink-0 border border-ink/10" />
                  ) : (
                    <div className="w-10 h-10 shrink-0 grain flex items-center justify-center font-display font-black text-sm text-bone" style={{ background: c.avatarBg }}>
                      {c.initials}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-semibold text-sm leading-tight truncate">{c.name}</div>
                    <div className="font-mono text-[9px] text-ink/40 truncate">{c.username}</div>
                  </div>
                  {c.fandom && (
                    <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-ink/30 bg-ink/5 px-1.5 py-px shrink-0">{c.fandom}</span>
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

const allFandoms = [
  { name: "ARMY",    group: "BTS",        color: "#7a2c5e" },
  { name: "BLINK",   group: "BLACKPINK",  color: "#ff3d68" },
  { name: "STAY",    group: "Stray Kids", color: "#0a0a0a" },
  { name: "ONCE",    group: "TWICE",      color: "#ff5a82" },
  { name: "MOA",     group: "TXT",        color: "#3a5cff" },
  { name: "EXO-L",   group: "EXO",        color: "#1c1c1c" },
  { name: "CARAT",   group: "SEVENTEEN",  color: "#ffd23f" },
  { name: "ATINY",   group: "ATEEZ",      color: "#7af0c8" },
  { name: "Bunnies", group: "NewJeans",   color: "#7af0c8" },
  { name: "DIVE",    group: "IVE",        color: "#ff3d68" },
];

const CITIES = [
  "Maputo","Matola","Beira","Nampula","Quelimane",
  "Pemba","Lichinga","Tete","Chimoio","Xai-Xai",
  "Inhambane","Maxixe","Nacala","Mocuba","Angoche",
];

export default function PerfilPage() {
  const { user }            = useAuth();
  const { update: updateSession } = useSession();

  const avatarRef = useRef<HTMLInputElement>(null);

  const [name,          setName]          = useState("");
  const [username,      setUsername]      = useState("");
  const [city,          setCity]          = useState("");
  const [bio,           setBio]           = useState("");
  const [fandoms,       setFandoms]       = useState<string[]>([]);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarErr,     setAvatarErr]     = useState("");
  const [saving,        setSaving]        = useState(false);
  const [saved,         setSaved]         = useState(false);
  const [error,         setError]         = useState("");
  const [modal,         setModal]         = useState<"followers" | "following" | null>(null);

  const [stats, setStats] = useState({ followers: 0, following: 0, posts: 0 });

  // Pré-preencher com dados do utilizador
  useEffect(() => {
    if (user) {
      setName(user.name);
      setUsername(user.username);
      setCity(user.city);
      setBio(user.bio);
      setFandoms(user.fandoms);
      if (user.image) setAvatarPreview(user.image);
    }
  }, [user]);

  useEffect(() => {
    fetch("/api/conta/perfil")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setStats(d); })
      .catch(() => {});
  }, []);

  if (!user) return null;

  const initials = user.name.split(" ").map((n) => n[0]).slice(0, 2).join("");

  function toggleFandom(f: string) {
    setFandoms((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);
  }

  async function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Preview imediato
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarErr("");
    setAvatarUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res  = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setAvatarErr(data.error ?? "Erro no upload");
        setAvatarPreview(user?.image ?? null);
        return;
      }
      // Guarda o URL do avatar no perfil imediatamente
      await fetch("/api/conta/perfil", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar_url: data.url }),
      });
      setAvatarPreview(data.url);
      await updateSession();
    } catch {
      setAvatarErr("Erro de ligação. Tenta novamente.");
      setAvatarPreview(user?.image ?? null);
    } finally {
      setAvatarUploading(false);
      if (avatarRef.current) avatarRef.current.value = "";
    }
  }

  async function handleSave(e: { preventDefault(): void }) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/conta/perfil", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, bio, city, fandoms }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao guardar");
        return;
      }
      await updateSession();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Erro de ligação");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8 lg:space-y-10">
      <div>
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink/50 mb-2">Conta / Perfil</div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
          Editar perfil<span className="text-coral">.</span>
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setModal("followers")}
          className="border border-ink/10 p-4 text-center hover:border-ink/30 hover:bg-ink/[0.02] transition-colors group"
        >
          <div className="font-display font-black text-2xl group-hover:text-coral transition-colors">{stats.followers}</div>
          <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-ink/40 mt-1 flex items-center justify-center gap-1">
            <Users size={10} /> Seguidores
          </div>
        </button>
        <button
          onClick={() => setModal("following")}
          className="border border-ink/10 p-4 text-center hover:border-ink/30 hover:bg-ink/[0.02] transition-colors group"
        >
          <div className="font-display font-black text-2xl group-hover:text-coral transition-colors">{stats.following}</div>
          <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-ink/40 mt-1 flex items-center justify-center gap-1">
            <Users size={10} /> A seguir
          </div>
        </button>
        <div className="border border-ink/10 p-4 text-center">
          <div className="font-display font-black text-2xl">{stats.posts}</div>
          <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-ink/40 mt-1 flex items-center justify-center gap-1">
            <Rss size={10} /> Posts
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">

        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="relative group">
            {/* Foto ou iniciais */}
            {avatarPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarPreview}
                alt="Avatar"
                className={`w-20 h-20 object-cover border-2 border-ink/10 transition-opacity ${avatarUploading ? "opacity-50" : ""}`}
              />
            ) : (
              <div className="w-20 h-20 bg-coral text-ink flex items-center justify-center font-display font-black text-2xl">
                {initials}
              </div>
            )}

            {/* Overlay de carregamento */}
            {avatarUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-bone/60">
                <Loader2 size={20} className="animate-spin text-ink" />
              </div>
            )}

            {/* Botão de câmara */}
            <button
              type="button"
              onClick={() => avatarRef.current?.click()}
              disabled={avatarUploading}
              title="Alterar foto"
              className="absolute bottom-0 right-0 w-7 h-7 bg-ink text-bone flex items-center justify-center hover:bg-coral transition-colors disabled:opacity-50"
            >
              <Camera size={13} strokeWidth={2} />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-lg leading-tight">{user.name}</div>
            <div className="font-mono text-xs text-ink/50">{user.email}</div>
            {avatarErr && (
              <div className="flex items-center gap-2 mt-1.5">
                <span className="font-mono text-[10px] text-coral">{avatarErr}</span>
                <button
                  type="button"
                  onClick={() => setAvatarErr("")}
                  className="text-ink/30 hover:text-ink"
                >
                  <X size={10} />
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => avatarRef.current?.click()}
              disabled={avatarUploading}
              className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-coral hover:underline disabled:opacity-40"
            >
              {avatarUploading ? "A carregar..." : "Alterar foto de perfil"}
            </button>
          </div>
        </div>

        {/* Input de ficheiro escondido para avatar */}
        <input
          ref={avatarRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleAvatarChange}
        />

        {/* Campos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <label className="block">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/60">Nome completo</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full mt-2 bg-transparent border border-ink/20 focus:border-ink px-4 py-3 font-mono text-sm focus:outline-none transition-colors"
            />
          </label>
          <label className="block">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/60">Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full mt-2 bg-transparent border border-ink/20 focus:border-ink px-4 py-3 font-mono text-sm focus:outline-none transition-colors"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/60">Bio</span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full mt-2 bg-transparent border border-ink/20 focus:border-ink px-4 py-3 font-mono text-sm focus:outline-none transition-colors resize-none"
            />
          </label>
          <label className="block">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/60">Cidade</span>
            <input
              list="city-list"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full mt-2 bg-transparent border border-ink/20 focus:border-ink px-4 py-3 font-mono text-sm focus:outline-none transition-colors"
            />
            <datalist id="city-list">
              {CITIES.map((c) => <option key={c} value={c} />)}
            </datalist>
          </label>
        </div>

        {/* Fandoms */}
        <div>
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/60 mb-4">Os meus fandoms</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {allFandoms.map((f) => {
              const active = fandoms.includes(f.name);
              return (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => toggleFandom(f.name)}
                  className="relative p-3 flex flex-col gap-1 border transition-all"
                  style={{
                    borderColor: active ? f.color : "rgba(10,10,10,0.15)",
                    background:  active ? f.color : "transparent",
                  }}
                >
                  {active && <Check size={10} className="absolute top-2 right-2 text-bone" strokeWidth={3} />}
                  <div className={`font-display font-bold text-base leading-tight ${active ? "text-bone" : ""}`}>{f.name}</div>
                  <div className={`font-mono text-[9px] uppercase tracking-[0.15em] ${active ? "text-bone/70" : "text-ink/40"}`}>{f.group}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Guardar */}
        <div className="flex items-center gap-4 pt-4 border-t border-ink/10">
          <button
            type="submit"
            disabled={saving}
            className="btn-brutal disabled:opacity-50"
            style={saved ? { background: "#7af0c8", borderColor: "#7af0c8", color: "#0a0a0a" } : {}}
          >
            {saved
              ? <><Check size={14} strokeWidth={2.5} /> Guardado</>
              : saving
              ? "A guardar..."
              : "Guardar alterações"}
          </button>
          {error && <span className="font-mono text-xs text-coral tracking-[0.1em]">{error}</span>}
          {saved && !error && <span className="font-mono text-xs text-ink/50 tracking-[0.15em] uppercase">Perfil actualizado</span>}
        </div>
      </form>

      {/* Modal de seguidores / a-seguir */}
      {modal && user && (
        <ConnectionsModal
          title={modal === "followers" ? "Seguidores" : "A seguir"}
          username={user.username}
          type={modal}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
