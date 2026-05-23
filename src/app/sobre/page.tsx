import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Users, Calendar, Zap, MapPin, Star } from "lucide-react";
import { Marquee } from "@/components/shared/Marquee";

export const metadata: Metadata = {
  title: "Sobre a KM — KPOP.MZ",
  description: "A história da KpopMoçambique: de um grupo de WhatsApp em 2020 à maior comunidade K-POP do país. Seis anos a construir um lugar para nós.",
};

const timeline = [
  {
    year: "2020",
    title: "Os primeiros encontros",
    text: "Os primeiros fãs moçambicanos de K-POP organizam-se online para partilhar músicas, vídeos e novidades. O WhatsApp é a principal ferramenta. A comunidade cresce de forma orgânica, sem estrutura formal.",
  },
  {
    year: "2021",
    title: "A comunidade ganha forma",
    text: "Grupo de organização da comunidade é formalizado. Começam os encontros presenciais regulares em Maputo: Random Dance Play, trocas de photocards e conversas sobre lançamentos. A Beira junta-se ao movimento.",
  },
  {
    year: "2022",
    title: "O primeiro grande festival",
    text: "K-POP Festival Moçambique 2022, em parceria com a Embaixada da Coreia do Sul. Cerimónia de premiação a 15 de Julho na Embaixada, seguida de performances a 24 de Setembro na Faculdade Joaquim Chissano. Os vencedores são entrevistados pela equipa KM.",
  },
  {
    year: "2023",
    title: "Crescimento constante",
    text: "A comunidade expande a presença online. Mais de 40 encontros realizados. Grupos de cover dance surgem em Maputo e Beira. A KM torna-se o ponto de referência para fãs de K-POP em todo o país.",
  },
  {
    year: "2025",
    title: "Festival expande",
    text: "Segunda edição do K-POP Festival Moçambique, com maior participação e novos parceiros. A Faculdade Joaquim Chissano confirma-se como palco principal. Os grupos de cover dance moçambicanos ganham projeção nacional.",
  },
  {
    year: "2026",
    title: "A plataforma digital",
    text: "Lançamento da KPOP.MZ — o ecossistema digital da comunidade. Notícias, eventos, talentos locais, marketplace e cultura coreana, tudo num só lugar, feito em Moçambique para fãs moçambicanos.",
  },
];

const values = [
  {
    num: "01",
    title: "Comunidade primeiro",
    text: "Nascemos das pessoas, não das marcas. Cada decisão da plataforma passa pela pergunta: isto serve os fãs moçambicanos?",
  },
  {
    num: "02",
    title: "Identidade local",
    text: "K-POP em Moçambique tem a sua cor própria. Misturamos a cultura coreana com a nossa realidade, sem apagar nenhuma das duas.",
  },
  {
    num: "03",
    title: "Talentos visíveis",
    text: "Dançarinos, editores, artistas, músicos. O nosso trabalho é tornar visível o que a comunidade local já cria há anos.",
  },
  {
    num: "04",
    title: "Acesso justo",
    text: "K-POP é caro. Trabalhamos para facilitar o acesso a merch, eventos e informação, dentro da realidade económica moçambicana.",
  },
];

const stats = [
  { num: "5.2K+", label: "Membros ativos" },
  { num: "6", label: "Anos de comunidade" },
  { num: "50+", label: "Eventos realizados" },
  { num: "3", label: "Festivais institucionais" },
  { num: "12+", label: "Grupos de cover dance" },
  { num: "2", label: "Cidades com presença física" },
];

export default function SobrePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 lg:pt-36 pb-12 lg:pb-20 relative overflow-hidden bg-ink text-bone grain">
        <div
          aria-hidden
          className="absolute right-[-2rem] top-1/2 -translate-y-1/2 hangul-deco font-black text-bone/[0.04] select-none pointer-events-none leading-none"
          style={{ fontSize: "clamp(8rem, 22vw, 24rem)" }}
        >
          우리
        </div>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 relative">
          <div className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-coral flex items-center gap-3 mb-4">
            <span className="inline-block w-6 h-px bg-coral" />
            <span>A nossa história</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end">
            <div className="lg:col-span-8">
              <h1
                className="font-display font-bold leading-[0.88] tracking-tight"
                style={{ fontSize: "clamp(2.75rem, 10vw, 9rem)" }}
              >
                Somos Moçambique<br />
                <span className="italic text-coral">no mapa</span><br />
                do K-POP.
              </h1>
            </div>
            <div className="lg:col-span-4 lg:pb-4">
              <p className="text-base sm:text-lg text-bone/75 leading-relaxed">
                A KpopMoçambique começou num grupo de WhatsApp em 2020. Hoje somos
                a maior comunidade K-POP do país, com eventos regulares, festivais
                institucionais e uma plataforma digital pensada para a nossa
                realidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-coral text-ink">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-ink/20">
            {stats.map(({ num, label }) => (
              <div key={label} className="py-6 lg:py-8 px-4 lg:px-6 first:pl-0">
                <div className="font-display font-black text-3xl sm:text-4xl lg:text-5xl leading-none tracking-tight">
                  {num}
                </div>
                <div className="font-mono text-[10px] tracking-[0.2em] uppercase mt-2 opacity-70">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Marquee items={["Random Dance", "Cover Dance", "Fan Meets", "Festivais", "Workshops", "Concursos", "Fanart"]} />

      {/* Origin story */}
      <section className="py-16 lg:py-24 bg-bone">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-5">
              <div className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-coral flex items-center gap-3 mb-4">
                <span className="inline-block w-6 h-px bg-coral" />
                <span>Manifesto</span>
              </div>
              <h2 className="font-display font-bold tracking-tight leading-[0.95] text-4xl sm:text-5xl lg:text-6xl">
                Começámos no<br />
                <span className="italic text-coral">WhatsApp.</span><br />
                Ficámos para sempre.
              </h2>
              <p className="text-base sm:text-lg text-ink/70 leading-relaxed mt-6 max-w-md">
                Em 2020, um grupo de fãs moçambicanos de K-POP descobriu-se mutuamente online.
                Não havia eventos, não havia estrutura, não havia plataforma. Só havia paixão
                partilhada e a vontade de fazer acontecer.
              </p>
              <p className="text-base sm:text-lg text-ink/70 leading-relaxed mt-4 max-w-md">
                Seis anos depois, organizámos mais de 50 eventos, dois festivais
                institucionais em parceria com a Embaixada da Coreia do Sul, e construímos
                uma comunidade que representa Moçambique no mapa global do K-POP.
              </p>
            </div>
            <div className="lg:col-span-7 lg:pl-8">
              <div className="space-y-0">
                {timeline.map((item, i) => (
                  <div
                    key={item.year}
                    className="grid grid-cols-[auto_1fr] gap-6 py-6 lg:py-8 border-t border-ink/15 first:border-t-0 group cursor-default"
                  >
                    <div className="font-display font-black text-3xl sm:text-5xl lg:text-6xl leading-none tabular-nums group-hover:text-coral transition-colors w-24 lg:w-32">
                      {item.year}
                    </div>
                    <div>
                      <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/60 mb-1">
                        {item.title}
                      </div>
                      <p className="text-sm sm:text-base leading-relaxed text-ink/75">
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

      {/* What KM does */}
      <section className="py-16 lg:py-24 bg-ink text-bone grain">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-coral flex items-center gap-3 mb-8">
            <span className="inline-block w-6 h-px bg-coral" />
            <span>O que fazemos</span>
          </div>
          <h2 className="font-display font-bold leading-[0.95] tracking-tight text-4xl sm:text-5xl lg:text-6xl max-w-3xl mb-12 lg:mb-16">
            Não somos só fãs.<br />
            <span className="italic text-coral">Somos organizadores.</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                Icon: Users,
                title: "Random Dance Play",
                text: "Encontros mensais com playlist surpresa de K-POP. Toda a gente dança, toda a gente é bem-vinda. Acontece em Maputo e Beira.",
              },
              {
                Icon: Star,
                title: "Cover Dance Showcase",
                text: "Grupos de cover dance moçambicanos sobem ao palco para apresentar performances inspiradas nos seus grupos favoritos.",
              },
              {
                Icon: Calendar,
                title: "Encontros de fãs",
                text: "Trocas de photocards, merch unofficial, conversas sobre comebacks e lançamentos. Um espaço seguro para ser fã sem julgamentos.",
              },
              {
                Icon: Zap,
                title: "K-POP Festival MZ",
                text: "O maior evento de K-POP de Moçambique. Cover dance, fanart, food court coreano e show de encerramento. Em parceria com a Embaixada da Coreia do Sul.",
              },
              {
                Icon: MapPin,
                title: "Presença em Maputo e Beira",
                text: "Atividades regulares nas duas maiores cidades do país. Comunidade ativa online para fãs em Nampula, Matola e resto do país.",
              },
              {
                Icon: ArrowUpRight,
                title: "Conteúdo e divulgação",
                text: "Cobertura de eventos, entrevistas com talentos locais, notícias de K-POP curadas para o contexto moçambicano.",
              },
            ].map(({ Icon, title, text }, i) => (
              <div key={title} className="group border border-bone/10 p-6 lg:p-8 hover:border-coral transition-colors">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 border border-bone/20 flex items-center justify-center group-hover:border-coral group-hover:text-coral transition-colors">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <div className="font-display font-black text-4xl text-bone/10">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <h3 className="font-display font-bold text-xl lg:text-2xl leading-tight mb-3">
                  {title}
                </h3>
                <p className="text-sm text-bone/70 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 lg:py-20 bg-bone border-b border-ink/10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-coral flex items-center gap-3 mb-8">
            <span className="inline-block w-6 h-px bg-coral" />
            <span>Parceiros</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <h2 className="font-display font-bold leading-[0.95] tracking-tight text-4xl sm:text-5xl">
              Construímos pontes<br />
              <span className="italic text-coral">entre culturas.</span>
            </h2>
            <div className="space-y-4">
              <div className="border border-ink/15 p-6 hover:border-coral transition-colors group">
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/60 mb-2">Parceiro institucional</div>
                <div className="font-display font-bold text-xl lg:text-2xl group-hover:text-coral transition-colors">
                  Embaixada da República da Coreia do Sul
                </div>
                <p className="text-sm text-ink/70 mt-2">
                  Parceiros nos K-POP Festival de 2022 e 2025. A colaboração institucional que deu escala e credibilidade ao maior evento de K-POP do país.
                </p>
              </div>
              <div className="border border-ink/15 p-6">
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/60 mb-2">Espaços parceiros</div>
                <div className="font-display font-bold text-xl lg:text-2xl">
                  Faculdade Joaquim Chissano
                </div>
                <p className="text-sm text-ink/70 mt-2">
                  Palco das edições do festival desde 2022. Um espaço que acolheu milhares de fãs e criou memórias que ficam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-bone">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-coral flex items-center gap-3 mb-8">
            <span className="inline-block w-6 h-px bg-coral" />
            <span>Valores</span>
          </div>
          <h2 className="font-display font-bold leading-[0.95] tracking-tight text-4xl sm:text-5xl lg:text-6xl max-w-2xl mb-12 lg:mb-16">
            O que nos<br />
            <span className="italic text-coral">define.</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            {values.map((v, i) => (
              <div
                key={v.num}
                className="py-8 lg:py-10 px-0 lg:px-10 border-t border-ink/15 first:border-t-0 sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(odd)]:pl-0 sm:[&:nth-child(even)]:border-l sm:[&:nth-child(even)]:pl-10 group"
              >
                <div className="font-display font-black text-4xl lg:text-6xl text-ink/10 mb-4">
                  {v.num}
                </div>
                <h3 className="font-display font-bold text-xl lg:text-2xl leading-tight mb-3 group-hover:text-coral transition-colors">
                  {v.title}
                </h3>
                <p className="text-sm sm:text-base text-ink/70 leading-relaxed max-w-md">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-32 bg-coral text-ink grain">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <div
            aria-hidden
            className="font-display font-black text-ink/[0.07] leading-none select-none pointer-events-none mb-[-2rem]"
            style={{ fontSize: "clamp(4rem, 15vw, 14rem)" }}
          >
            KM
          </div>
          <div className="relative">
            <h2
              className="font-display font-black tracking-[-0.02em] leading-[0.9]"
              style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)" }}
            >
              A tua história<br />começa aqui.
            </h2>
            <p className="mt-6 lg:mt-8 text-base sm:text-lg text-ink/80 leading-relaxed max-w-2xl mx-auto">
              Junta-te à comunidade, participa nos eventos, mostra o que sabes fazer.
              O K-POP em Moçambique somos todos nós.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/comunidade" className="btn-brutal">
                Entrar na KM
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/eventos"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-ink font-mono text-xs uppercase tracking-[0.15em] font-semibold hover:bg-ink hover:text-bone transition-colors"
              >
                Ver próximos eventos
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
