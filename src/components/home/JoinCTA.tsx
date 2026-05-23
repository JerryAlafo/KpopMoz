import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export function JoinCTA() {
  return (
    <section className="relative py-20 lg:py-32 bg-coral text-ink overflow-hidden grain">
      {/* Decorative giant hangul */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span
          className="hangul-deco font-black text-ink/[0.07] leading-none"
          style={{ fontSize: "clamp(10rem, 35vw, 32rem)" }}
        >
          함께
        </span>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="font-mono text-[10px] sm:text-xs tracking-[0.35em] uppercase mb-6 flex items-center justify-center gap-3">
            <span className="inline-block w-6 h-px bg-ink" />
            <span>Junta-te à comunidade</span>
            <span className="inline-block w-6 h-px bg-ink" />
          </div>
          <h2
            className="font-display font-black tracking-[-0.02em] leading-[0.9]"
            style={{ fontSize: "clamp(2.5rem, 9vw, 8rem)" }}
          >
            O teu fandom<br />
            tem casa aqui.
          </h2>
          <p className="mt-6 lg:mt-8 text-base sm:text-lg lg:text-xl text-ink/80 leading-relaxed max-w-2xl mx-auto">
            ARMY, BLINK, STAY, ONCE, MOA, EXO-L, CARAT, ATINY, DIVE, Bunnies - vem
            como és, traz o teu bias, partilha o que fazes.
          </p>
          <div className="mt-8 lg:mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/comunidade" className="btn-brutal">
              Criar conta
              <ArrowRight size={14} />
            </Link>
            <a
              href="https://chat.whatsapp.com/HZwzHk4DOO67h6WLyDYKpK"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-ink font-mono text-xs uppercase tracking-[0.15em] font-semibold hover:bg-ink hover:text-bone transition-colors"
            >
              <MessageCircle size={14} />
              Grupo WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
