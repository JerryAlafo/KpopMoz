"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useAuth } from "@/contexts/auth";

const cities = ["Maputo", "Matola", "Beira", "Nampula", "Quelimane", "Tete", "Outra"];

const allFandoms = [
  { name: "ARMY", group: "BTS", color: "#7a2c5e" },
  { name: "BLINK", group: "BLACKPINK", color: "#ff3d68" },
  { name: "STAY", group: "Stray Kids", color: "#0a0a0a" },
  { name: "ONCE", group: "TWICE", color: "#ff5a82" },
  { name: "MOA", group: "TXT", color: "#3a5cff" },
  { name: "EXO-L", group: "EXO", color: "#1c1c1c" },
  { name: "CARAT", group: "SEVENTEEN", color: "#ffd23f" },
  { name: "ATINY", group: "ATEEZ", color: "#7af0c8" },
  { name: "Bunnies", group: "NewJeans", color: "#7af0c8" },
  { name: "DIVE", group: "IVE", color: "#ff3d68" },
];

export default function PerfilPage() {
  const { user } = useAuth();
  if (!user) return null;

  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [city, setCity] = useState(user.city);
  const [bio, setBio] = useState(user.bio);
  const [fandoms, setFandoms] = useState<string[]>(user.fandoms);
  const [saved, setSaved] = useState(false);

  function toggleFandom(f: string) {
    setFandoms((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

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

      <form onSubmit={handleSave} className="space-y-8">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-coral text-ink flex items-center justify-center font-display font-black text-2xl">
            {user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <div>
            <div className="font-display font-bold text-lg">{user.name}</div>
            <div className="font-mono text-xs text-ink/50">{user.email}</div>
          </div>
        </div>

        {/* Basic info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <label className="block">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/60">Nome completo</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-2 bg-transparent border border-ink/20 focus:border-ink px-4 py-3 font-mono text-sm focus:outline-none transition-colors"
            />
          </label>
          <label className="block">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/60">Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full mt-2 bg-bone border border-ink/20 focus:border-ink px-4 py-3 font-mono text-sm focus:outline-none transition-colors"
            >
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
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
                    background: active ? f.color : "transparent",
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

        {/* Save */}
        <div className="flex items-center gap-4 pt-4 border-t border-ink/10">
          <button
            type="submit"
            className="btn-brutal"
            style={saved ? { background: "#7af0c8", borderColor: "#7af0c8", color: "#0a0a0a" } : {}}
          >
            {saved ? <><Check size={14} strokeWidth={2.5} /> Guardado</> : "Guardar alterações"}
          </button>
          {saved && (
            <span className="font-mono text-xs text-ink/50 tracking-[0.15em] uppercase">
              Perfil actualizado
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
