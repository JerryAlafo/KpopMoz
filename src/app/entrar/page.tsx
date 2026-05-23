"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/auth";

export default function EntrarPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Preenche o email e a password.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login(email);
      router.push("/conta");
    }, 800);
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left — branding panel */}
      <div className="hidden lg:flex flex-col justify-between bg-ink text-bone grain p-10 lg:p-16 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute left-[-3rem] bottom-[-4rem] hangul-deco font-black text-bone/[0.04] select-none pointer-events-none leading-none"
          style={{ fontSize: "clamp(10rem, 25vw, 28rem)" }}
        >
          로그인
        </div>
        {/* <Link href="/" className="flex items-center gap-2 relative z-10">
          <div className="relative w-10 h-10 bg-coral flex items-center justify-center">
            <span className="hangul-deco text-ink text-xl leading-none">K</span>
          </div>
          <div className="leading-none">
            <div className="font-display text-lg font-bold">
              KPOP<span className="text-coral">.</span>MZ
            </div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-bone/50 mt-0.5">
              COMUNIDADE OFICIAL
            </div>
          </div>
        </Link> */}

        <div className="relative z-10">
          <h1 className="font-display font-bold leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}>
            Bem-vindo<br />
            de volta<span className="text-coral">.</span>
          </h1>
          <p className="mt-6 text-base text-bone/70 leading-relaxed max-w-sm">
            A tua comunidade K-POP em Moçambique está aqui. Eventos, notícias,
            talentos e os teus fandoms favoritos, num só lugar.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 relative z-10">
          {[
            { num: "8 000+", label: "Membros" },
            { num: "48", label: "Eventos" },
            { num: "2020", label: "Desde" },
          ].map((s) => (
            <div key={s.label} className="border border-bone/15 p-4">
              <div className="font-display font-black text-2xl lg:text-3xl text-coral">
                {s.num}
              </div>
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/50 mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center px-6 py-24 lg:py-16 bg-bone">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="relative w-9 h-9 bg-ink flex items-center justify-center">
              <span className="hangul-deco text-bone text-lg leading-none">K</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-coral" />
            </div>
            <div className="font-display text-base font-bold">
              KPOP<span className="text-coral">.</span>MZ
            </div>
          </Link>

          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-coral flex items-center gap-3 mb-4">
            <span className="inline-block w-6 h-px bg-coral" />
            <span>Entrar na conta</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight mb-8">
            Aceder à<br />plataforma.
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/60">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="o.teu@email.mz"
                className="w-full mt-2 bg-transparent border border-ink/20 focus:border-ink px-4 py-3 font-mono text-sm placeholder:text-ink/30 focus:outline-none transition-colors"
              />
            </label>

            <label className="block">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/60">
                  Password
                </span>
                <a href="#" className="font-mono text-[10px] tracking-[0.15em] uppercase text-coral hover:underline">
                  Esqueceste?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent border border-ink/20 focus:border-ink px-4 py-3 pr-12 font-mono text-sm placeholder:text-ink/30 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            {error && (
              <p className="font-mono text-[11px] tracking-[0.15em] text-coral">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-brutal justify-center mt-2 disabled:opacity-60"
            >
              {loading ? "A entrar…" : "Entrar na KM"}
              {!loading && <ArrowRight size={14} />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-ink/10">
            <p className="font-mono text-xs text-ink/60 text-center">
              Ainda não tens conta?{" "}
              <Link href="/comunidade" className="text-coral hover:underline">
                Criar conta grátis
              </Link>
            </p>
          </div>

          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/30 text-center mt-8">
            Para demonstração, usa qualquer email + password
          </p>
        </div>
      </div>
    </div>
  );
}
