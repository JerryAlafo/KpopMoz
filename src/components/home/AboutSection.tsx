import Link from "next/link";
import { ArrowRight } from "lucide-react";

const timeline = [
  { year: "2020", text: "Primeiros fãs moçambicanos organizam-se online" },
  { year: "2021", text: "Grupo de organização da comunidade é formalizado" },
  { year: "2022", text: "K-POP Festival Mozambique com a Embaixada da Coreia" },
  { year: "2025", text: "Festival expande para Faculdade Joaquim Chissano" },
  { year: "2026", text: "Lançamento da plataforma digital KPOP.MZ" },
];

export function AboutSection() {
  return (
    <section className="py-16 lg:py-24 bg-bone relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-coral mb-4 flex items-center gap-3">
              <span className="inline-block w-8 h-px bg-coral" />
              <span>Manifesto</span>
            </div>
            <h2 className="font-display font-bold tracking-tight leading-[0.95] text-4xl sm:text-5xl lg:text-6xl">
              Seis anos a construir<br />
              <span className="italic text-coral">um lugar</span> para nós.
            </h2>
            <p className="text-base sm:text-lg text-ink/70 leading-relaxed mt-6 max-w-md">
              A KM começou com mensagens espalhadas em WhatsApp. Hoje somos a maior
              comunidade K-POP do país, com encontros mensais, dois festivais
              institucionais e uma plataforma digital pensada para a nossa
              realidade.
            </p>
            <Link
              href="/sobre"
              className="btn-brutal mt-8"
            >
              A nossa história
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="lg:col-span-7 lg:pl-8">
            <div className="space-y-0">
              {timeline.map((item) => (
                <div
                  key={item.year}
                  className="grid grid-cols-[auto_1fr] gap-6 py-5 lg:py-7 border-t border-ink/15 first:border-t-0 lg:first:border-t group cursor-default"
                >
                  <div className="font-display font-black text-3xl sm:text-5xl lg:text-6xl leading-none tabular-nums group-hover:text-coral transition-colors">
                    {item.year}
                  </div>
                  <div className="flex items-center">
                    <p className="text-base sm:text-lg leading-snug">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
