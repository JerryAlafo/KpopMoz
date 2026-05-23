import Link from "next/link";
import { ArrowRight, Calendar, Users, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-24 lg:pt-32 pb-12 lg:pb-20 overflow-hidden">
      {/* Decorative hangul */}
      <div
        aria-hidden
        className="absolute right-[-2rem] top-12 lg:top-24 hangul-deco font-black text-ink/[0.04] select-none pointer-events-none leading-none"
        style={{ fontSize: "clamp(8rem, 22vw, 24rem)" }}
      >
        케이팝
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 relative">
        {/* Top meta strip */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-ink/60 mb-8 lg:mb-12">
          <div className="flex items-center gap-2">
            <span className="live-dot" />
            <span>Em direto · Comunidade ativa</span>
          </div>
          <span className="hidden sm:inline">EST. 2020</span>
          <span className="hidden md:inline">Maputo · Beira · Online</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end">
          <div className="lg:col-span-8">
            <h1 className="font-display font-bold tracking-[-0.02em] leading-[0.88]"
                style={{ fontSize: "clamp(2.75rem, 11vw, 11rem)" }}>
              O coração do{" "}
              <span className="relative inline-block">
                <span className="text-coral italic">K-POP</span>
                <svg
                  aria-hidden
                  viewBox="0 0 200 14"
                  className="absolute -bottom-1 left-0 w-full h-3 lg:h-4"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 11 Q 50 2, 100 8 T 198 5"
                    fill="none"
                    stroke="#ff3d68"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              bate em<br className="hidden sm:block" /> Moçambique.
            </h1>
          </div>

          <div className="lg:col-span-4 lg:pb-4">
            <p className="text-base sm:text-lg leading-relaxed text-ink/75 max-w-md">
              Comunidade desde 2020. Encontros mensais, festivais com a Embaixada da
              Coreia, talentos locais a crescer. Agora num só lugar, com a tua cor.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link href="/comunidade" className="btn-brutal">
                Entrar na KM
                <ArrowRight size={14} />
              </Link>
              <Link href="/eventos" className="btn-brutal btn-brutal--invert">
                Próximos eventos
              </Link>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-12 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 border-t border-ink/15 border-b border-ink/15 divide-y lg:divide-y-0 lg:divide-x divide-ink/15">
          {[
            { num: "5,2K", label: "Membros activos", Icon: Users },
            { num: "48", label: "Eventos desde 2020", Icon: Calendar },
            { num: "3", label: "Festivais com a Embaixada", Icon: Zap },
            { num: "12+", label: "Grupos de cover dance", Icon: Users },
          ].map(({ num, label, Icon }, i) => (
            <div
              key={i}
              className="py-6 lg:py-8 px-4 lg:px-6 first:pl-0 group cursor-default"
            >
              <Icon size={16} className="text-coral mb-3" strokeWidth={1.75} />
              <div className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-none">
                {num}
              </div>
              <div className="font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-ink/60 mt-2">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
