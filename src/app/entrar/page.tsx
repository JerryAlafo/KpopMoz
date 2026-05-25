"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { signIn, useSession } from "next-auth/react";

function formatCount(n: number): string {
  if (n >= 1000) return `${Math.floor(n / 1000)} ${(n % 1000).toString().padStart(3, "0")}+`;
  return String(n);
}

export default function EntrarPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [members, setMembers] = useState("...");
  const [events, setEvents] = useState("...");
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    fetch("/api/stats", { cache: "no-store" })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) {
          setMembers(formatCount(data.members));
          setEvents(String(data.events));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (session.user?.isBanned) {
      router.replace("/banido");
      return;
    }
    if (session.user?.onboardingComplete === false) {
      router.replace("/onboarding");
      return;
    }
    router.replace("/conta/feed");
  }, [router, session, status]);

  async function handleLogin(e: { preventDefault(): void }) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Preenche o email e a password.");
      return;
    }
    setLoading(true);
    const res = await signIn("credentials", {
      email, password, callbackUrl: "/conta/feed", redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("E-mail ou palavra-passe incorretos.");
    } else if (res?.url) {
      router.push(res.url);
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Esquerda — painel de branding */}
      <div className="hidden lg:flex flex-col justify-between bg-ink text-bone grain p-10 lg:p-16 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute left-[-3rem] bottom-[-4rem] hangul-deco font-black text-bone/[0.04] select-none pointer-events-none leading-none"
          style={{ fontSize: "clamp(10rem, 25vw, 28rem)" }}
        >
          로그인
        </div>

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
            { num: members, label: "Membros" },
            { num: events,  label: "Eventos" },
            { num: "2020",  label: "Desde"   },
          ].map((s) => (
            <div key={s.label} className="border border-bone/15 p-4">
              <div className="font-display font-black text-2xl lg:text-3xl text-coral">{s.num}</div>
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/50 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Direita — formulário */}
      <div className="flex items-center justify-center px-6 py-24 lg:py-16 bg-bone">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <Link href="/" className="flex items-center gap-2.5 mb-10 lg:hidden">
            <Image src="/favicon.png" alt="KPOP.MZ" width={36} height={36} className="w-9 h-9 object-contain" />
            <div className="font-display text-base font-bold">
              KPOP<span className="text-coral">.</span>MZ
            </div>
          </Link>

          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-coral flex items-center gap-3 mb-4">
            <span className="inline-block w-6 h-px bg-coral" />
            <span>Entrar na conta</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight mb-8">
            Aceder à<br />plataforma<span className="text-coral">.</span>
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
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
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/60">
                Password
              </span>
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
              <p className="font-mono text-[11px] tracking-[0.15em] text-coral">{error}</p>
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

          {/* Separador Google */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-ink/10" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/30">ou</span>
            <div className="flex-1 h-px bg-ink/10" />
          </div>

          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/conta/feed" })}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border border-ink/20 hover:border-ink font-mono text-sm uppercase tracking-[0.2em] text-ink/70 hover:text-ink transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar com Google
          </button>

          <div className="mt-8 pt-8 border-t border-ink/10">
            <p className="font-mono text-xs text-ink/60 text-center">
              Ainda não tens conta?{" "}
              <Link href="/comunidade" className="text-coral hover:underline">
                Criar conta grátis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
