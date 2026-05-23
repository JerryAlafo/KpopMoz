"use client";

import { useAuth } from "@/contexts/auth";
import Link from "next/link";
import { Lock } from "lucide-react";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (user) return <>{children}</>;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="w-14 h-14 bg-ink flex items-center justify-center mx-auto">
          <Lock size={22} className="text-coral" />
        </div>
        <div>
          <h2 className="font-display font-bold text-2xl tracking-tight">
            Conteúdo exclusivo<span className="text-coral">.</span>
          </h2>
          <p className="mt-2 font-mono text-xs text-ink/50 tracking-[0.1em] uppercase leading-relaxed">
            Esta secção é apenas para membros da comunidade KM.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/entrar" className="btn-brutal w-full justify-center">
            Entrar na conta
          </Link>
          <Link
            href="/comunidade"
            className="font-mono text-xs uppercase tracking-[0.15em] text-ink/50 hover:text-coral transition-colors"
          >
            Criar conta grátis →
          </Link>
        </div>
      </div>
    </div>
  );
}
