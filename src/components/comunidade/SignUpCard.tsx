"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

const CITY_SUGGESTIONS = [
  "Maputo", "Matola", "Beira", "Nampula", "Quelimane",
  "Pemba", "Lichinga", "Tete", "Chimoio", "Xai-Xai",
  "Inhambane", "Maxixe", "Nacala", "Mocuba", "Angoche",
];

export function SignUpCard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, city }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível criar a conta.");
        setLoading(false);
        return;
      }
      const signin = await signIn("credentials", {
        email, password, callbackUrl: "/conta", redirect: false,
      });
      if (signin?.url) router.push(signin.url);
    } catch {
      setError("Ocorreu um erro. Tenta novamente.");
    }
    setLoading(false);
  }

  return (
    <div className="lg:sticky lg:top-28 self-start bg-ink text-bone p-6 lg:p-8 relative">
      <div className="absolute -top-3 -right-3 bg-coral text-ink px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] uppercase font-semibold">
        Grátis
      </div>
      <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-bone/60 mb-3">
        Criar conta KPOP.MZ
      </div>
      <h3 className="font-display font-bold text-2xl lg:text-3xl leading-tight">
        Bem-vindo à<br />comunidade.
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3 mt-6">
        <label className="block">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/60">Nome</span>
          <input
            type="text" required value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="O teu nome"
            className="w-full bg-transparent border-b border-bone/30 py-2 mt-1 focus:border-coral focus:outline-none transition-colors text-sm placeholder:text-bone/30"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/60">Email</span>
          <input
            type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="o.teu@email.mz"
            className="w-full bg-transparent border-b border-bone/30 py-2 mt-1 focus:border-coral focus:outline-none transition-colors text-sm placeholder:text-bone/30"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/60">Password</span>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"} required minLength={6} value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full bg-transparent border-b border-bone/30 py-2 mt-1 pr-8 focus:border-coral focus:outline-none transition-colors text-sm placeholder:text-bone/30"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-0 top-1/2 text-bone/40 hover:text-bone transition-colors"
            >
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </label>
        <label className="block">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/60">Cidade</span>
          <input
            type="text"
            list="city-suggestions"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="A tua cidade"
            className="w-full bg-transparent border-b border-bone/30 py-2 mt-1 focus:border-coral focus:outline-none transition-colors text-sm placeholder:text-bone/30"
          />
          <datalist id="city-suggestions">
            {CITY_SUGGESTIONS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </label>

        {error && (
          <p className="font-mono text-[11px] tracking-[0.15em] text-coral">{error}</p>
        )}

        <button
          type="submit" disabled={loading}
          className="mt-2 w-full bg-coral text-ink font-mono text-xs tracking-[0.2em] uppercase font-semibold py-3 hover:bg-bone transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? "A criar conta…" : "Criar conta"}
          {!loading && <ArrowRight size={14} />}
        </button>
      </form>

      {/* Separador */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-bone/20" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/30">ou</span>
        <div className="flex-1 h-px bg-bone/20" />
      </div>

      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/conta" })}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-bone/20 hover:border-bone/50 font-mono text-xs uppercase tracking-[0.2em] text-bone/60 hover:text-bone transition-colors"
      >
        <GoogleIcon />
        Continuar com Google
      </button>

      <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-bone/40 mt-4 text-center">
        Já tens conta?{" "}
        <Link href="/entrar" className="text-coral hover:underline">Entrar</Link>
      </p>
    </div>
  );
}
