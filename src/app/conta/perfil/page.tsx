"use client";

import { useState, useEffect } from "react";
import { Check, Users, Rss } from "lucide-react";
import { useAuth } from "@/contexts/auth";

const allFandoms = [
  { name: "ARMY",  group: "BTS",        color: "#7a2c5e" },
  { name: "BLINK", group: "BLACKPINK",  color: "#ff3d68" },
  { name: "STAY",  group: "Stray Kids", color: "#0a0a0a" },
  { name: "ONCE",  group: "TWICE",      color: "#ff5a82" },
  { name: "MOA",   group: "TXT",        color: "#3a5cff" },
  { name: "EXO-L", group: "EXO",        color: "#1c1c1c" },
  { name: "CARAT", group: "SEVENTEEN",  color: "#ffd23f" },
  { name: "ATINY", group: "ATEEZ",      color: "#7af0c8" },
  { name: "Bunnies", group: "NewJeans", color: "#7af0c8" },
  { name: "DIVE",  group: "IVE",        color: "#ff3d68" },
];

const CITIES = [
  "Maputo","Matola","Beira","Nampula","Quelimane",
  "Pemba","Lichinga","Tete","Chimoio","Xai-Xai",
  "Inhambane","Maxixe","Nacala","Mocuba","Angoche",
];

export default function PerfilPage() {
  const { user } = useAuth();
  if (!user) return null;

  const [name,     setName]     = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [city,     setCity]     = useState(user.city);
  const [bio,      setBio]      = useState(user.bio);
  const [fandoms,  setFandoms]  = useState<string[]>(user.fandoms);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [error,    setError]    = useState("");

  const [stats, setStats] = useState({ followers: 0, following: 0, posts: 0 });

  useEffect(() => {
    fetch("/api/conta/perfil")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setStats(d); })
      .catch(() => {});
  }, []);

  function toggleFandom(f: string) {
    setFandoms((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
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
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Erro de ligação");
    } finally {
      setSaving(false);
    }
  }

  const initials = user.name.split(" ").map((n) => n[0]).slice(0, 2).join("");

  return (
    <div className="space-y-8 lg:space-y-10">
      <div>
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink/50 mb-2">
          Conta / Perfil
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
          Editar perfil<span className="text-coral">.</span>
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Seguidores", value: stats.followers, icon: <Users size={13} /> },
          { label: "A seguir",   value: stats.following, icon: <Users size={13} /> },
          { label: "Posts",      value: stats.posts,     icon: <Rss size={13} /> },
        ].map((s) => (
          <div key={s.label} className="border border-ink/10 p-4 text-center">
            <div className="font-display font-black text-2xl">{s.value}</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-ink/40 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-coral text-ink flex items-center justify-center font-display font-black text-2xl">
            {initials}
          </div>
          <div>
            <div className="font-display font-bold text-lg">{user.name}</div>
            <div className="font-mono text-xs text-ink/50">{user.email}</div>
          </div>
        </div>

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
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/60 mb-4">
            Os meus fandoms
          </div>
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
                  {active && (
                    <Check size={10} className="absolute top-2 right-2 text-bone" strokeWidth={3} />
                  )}
                  <div className={`font-display font-bold text-base leading-tight ${active ? "text-bone" : ""}`}>
                    {f.name}
                  </div>
                  <div className={`font-mono text-[9px] uppercase tracking-[0.15em] ${active ? "text-bone/70" : "text-ink/40"}`}>
                    {f.group}
                  </div>
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
          {error && (
            <span className="font-mono text-xs text-coral tracking-[0.1em]">{error}</span>
          )}
          {saved && !error && (
            <span className="font-mono text-xs text-ink/50 tracking-[0.15em] uppercase">Perfil actualizado</span>
          )}
        </div>
      </form>
    </div>
  );
}
