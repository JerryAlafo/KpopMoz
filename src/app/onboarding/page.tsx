"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Check, ArrowRight, Sparkles } from "lucide-react";

const CITIES = [
  "Maputo", "Matola", "Beira", "Nampula", "Quelimane",
  "Pemba", "Lichinga", "Tete", "Chimoio", "Xai-Xai",
  "Inhambane", "Maxixe", "Nacala", "Mocuba", "Angoche",
];

const FANDOMS = [
  { name: "ARMY", group: "BTS", color: "#7a2c5e" },
  { name: "BLINK", group: "BLACKPINK", color: "#ff3d68" },
  { name: "STAY", group: "Stray Kids", color: "#1c1c1c" },
  { name: "ONCE", group: "TWICE", color: "#ff5a82" },
  { name: "MOA", group: "TXT", color: "#3a5cff" },
  { name: "EXO-L", group: "EXO", color: "#0a0a0a" },
  { name: "CARAT", group: "SEVENTEEN", color: "#c49a00" },
  { name: "ATINY", group: "ATEEZ", color: "#1a8c6e" },
  { name: "Bunnies", group: "NewJeans", color: "#1a8c6e" },
  { name: "DIVE", group: "IVE", color: "#c0185e" },
  { name: "ReVeluv", group: "Red Velvet", color: "#b52222" },
  { name: "STAR1", group: "BTOB", color: "#2255cc" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [fandoms, setFandoms] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Pré-preencher com dados do Google
  useEffect(() => {
    if (session?.user) {
      if (session.user.name) setName(session.user.name);
      if (session.user.email) {
        const base = session.user.email
          .split("@")[0]
          .replace(/[^a-z0-9_]/gi, "")
          .toLowerCase();
        setUsername(`@${base}`);
      }
    }
  }, [session]);

  // Redirecionar se não autenticado ou se onboarding já completo
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/entrar");
    }
    if (status === "authenticated" && session?.user?.onboardingComplete === true) {
      router.replace("/conta");
    }
  }, [status, session, router]);

  function toggleFandom(f: string) {
    setFandoms((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !username.trim() || !city.trim()) {
      setError("Preenche o nome, username e cidade.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, city, bio, fandoms }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao guardar. Tenta novamente.");
        return;
      }
      // Força refresh da session para actualizar onboardingComplete
      await update();
      router.replace("/conta/feed");
    } catch {
      setError("Erro de ligação. Tenta novamente.");
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/30">
          A carregar...
        </div>
      </div>
    );
  }

  const initials = name
    ? name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "KM";

  return (
    <div className="min-h-screen bg-ink text-bone flex flex-col">

      {/* Cabeçalho */}
      <div className="border-b border-bone/10 px-6 py-4 flex items-center justify-between">
        <div className="font-display font-black text-xl tracking-tight">
          KPOP<span className="text-coral">.</span>MZ
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-bone/40">
          <Sparkles size={11} className="text-coral" />
          Configuração inicial
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 flex items-start justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-2xl">

          {/* Saudação */}
          <div className="mb-10">
            <div
              className="w-16 h-16 grain flex items-center justify-center font-display font-black text-2xl text-bone mb-5"
              style={{ background: "linear-gradient(135deg,#ff4d4d,#ff9a4d)" }}
            >
              {initials}
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-bone mb-2">
              Bem-vindo(a) à comunidade<span className="text-coral">.</span>
            </h1>
            <p className="font-mono text-sm text-bone/50 tracking-[0.05em]">
              Só precisamos de alguns detalhes para completar o teu perfil.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Nome + Username */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-bone/50">
                  Nome <span className="text-coral">*</span>
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="O teu nome"
                  className="w-full mt-2 bg-transparent border border-bone/20 focus:border-bone px-4 py-3 font-mono text-sm text-bone placeholder:text-bone/20 focus:outline-none transition-colors"
                />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-bone/50">
                  Username <span className="text-coral">*</span>
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="@username"
                  className="w-full mt-2 bg-transparent border border-bone/20 focus:border-bone px-4 py-3 font-mono text-sm text-bone placeholder:text-bone/20 focus:outline-none transition-colors"
                />
                <span className="font-mono text-[9px] text-bone/30 mt-1 block">
                  Visível para outros membros
                </span>
              </label>
            </div>

            {/* Cidade + Bio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-bone/50">
                  Cidade <span className="text-coral">*</span>
                </span>
                <input
                  list="onb-cities"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  placeholder="A tua cidade"
                  className="w-full mt-2 bg-transparent border border-bone/20 focus:border-bone px-4 py-3 font-mono text-sm text-bone placeholder:text-bone/20 focus:outline-none transition-colors"
                />
                <datalist id="onb-cities">
                  {CITIES.map((c) => <option key={c} value={c} />)}
                </datalist>
              </label>
              <label className="block">
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-bone/50">
                  Bio <span className="text-bone/30">(opcional)</span>
                </span>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Conta algo sobre ti..."
                  className="w-full mt-2 bg-transparent border border-bone/20 focus:border-bone px-4 py-3 font-mono text-sm text-bone placeholder:text-bone/20 focus:outline-none transition-colors resize-none"
                />
              </label>
            </div>

            {/* Fandoms */}
            <div>
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-bone/50 mb-3">
                Os meus fandoms{" "}
                <span className="text-bone/30">(opcional — podes adicionar mais tarde)</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {FANDOMS.map((f) => {
                  const active = fandoms.includes(f.name);
                  return (
                    <button
                      key={f.name}
                      type="button"
                      onClick={() => toggleFandom(f.name)}
                      className="relative p-2.5 flex flex-col gap-0.5 border transition-all"
                      style={{
                        borderColor: active ? f.color : "rgba(255,255,255,0.1)",
                        background: active ? f.color : "rgba(255,255,255,0.03)",
                      }}
                    >
                      {active && (
                        <Check size={9} className="absolute top-1.5 right-1.5 text-bone" strokeWidth={3} />
                      )}
                      <div className="font-display font-bold text-sm text-bone leading-tight">
                        {f.name}
                      </div>
                      <div className="font-mono text-[8px] uppercase tracking-[0.1em] text-bone/50">
                        {f.group}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="border border-coral/40 bg-coral/10 px-4 py-3 font-mono text-xs text-coral tracking-[0.1em]">
                {error}
              </div>
            )}

            {/* CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving || !name.trim() || !username.trim() || !city.trim()}
                className="flex items-center gap-3 px-8 py-4 bg-coral text-bone font-mono text-[11px] uppercase tracking-[0.3em] border-2 border-coral hover:bg-coral/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? (
                  "A guardar..."
                ) : (
                  <>Entrar na comunidade <ArrowRight size={14} strokeWidth={2} /></>
                )}
              </button>
              <p className="font-mono text-[9px] text-bone/30 mt-3 tracking-[0.1em] uppercase">
                Podes editar tudo isto mais tarde em Conta → Perfil
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
