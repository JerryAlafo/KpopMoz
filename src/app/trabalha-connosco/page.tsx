import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trabalha Connosco — KPOP.MZ",
  description: "Junta-te à equipa da KpopMoçambique como voluntário, parceiro ou colaborador.",
};

const roles = [
  {
    area: "Conteúdo & Editorial",
    positions: [
      {
        title: "Redator(a) de notícias K-POP",
        type: "Voluntário",
        commitment: "2–4h/semana",
        desc: "Escreves artigos sobre comebacks, tours, indústria e cultura coreana em Português para o nosso feed de notícias.",
        skills: ["Português fluente", "Conhecimento K-POP", "Pesquisa online"],
      },
      {
        title: "Criador(a) de conteúdo educativo",
        type: "Voluntário",
        commitment: "3–5h/semana",
        desc: "Desenvolves guias, glossários e artigos sobre cultura coreana, Hangul e história do K-POP para a secção Aprender.",
        skills: ["Escrita clara", "Coreano básico (plus)", "Paciência didática"],
      },
    ],
  },
  {
    area: "Design & Criativo",
    positions: [
      {
        title: "Designer gráfico(a)",
        type: "Voluntário / Freelance",
        commitment: "Projetos pontuais",
        desc: "Crias materiais visuais para eventos, redes sociais e plataforma. Familiaridade com o nosso estilo editorial-neobrutalist é uma vantagem.",
        skills: ["Figma / Adobe", "Tipografia", "Estética editorial"],
      },
      {
        title: "Fotógrafo(a) / Videomaker",
        type: "Voluntário",
        commitment: "Eventos (8–12/ano)",
        desc: "Cobres os nossos eventos em Maputo e Beira — Random Dance, Cover Dance, festivais — e entregas conteúdo editado.",
        skills: ["Câmara/smartphone", "Edição básica", "Mobilidade Maputo/Beira"],
      },
    ],
  },
  {
    area: "Organização & Eventos",
    positions: [
      {
        title: "Coordenador(a) de evento",
        type: "Voluntário",
        commitment: "Eventos presenciais",
        desc: "Ajudas a coordenar logística de eventos: inscrições, comunicação com participantes, setup e gestão no local.",
        skills: ["Organização", "Comunicação", "Disponibilidade Maputo ou Beira"],
      },
      {
        title: "Embaixador(a) regional",
        type: "Voluntário",
        commitment: "Flexível",
        desc: "Representas a KM na tua cidade (Nampula, Beira, Quelimane, etc.) — organizas encontros locais e ligas a comunidade à plataforma central.",
        skills: ["Liderança informal", "Redes sociais", "Paixão pelo K-POP"],
      },
    ],
  },
];

const values = [
  { title: "Comunidade primeiro", text: "Trabalhamos para a comunidade, não para métricas. Cada decisão começa com 'o que é melhor para os fãs?'" },
  { title: "Sem hierarquias rígidas", text: "Somos uma organização flat. Tens uma ideia boa — diz. Não precisas de título para contribuir." },
  { title: "Moçambique no centro", text: "Tudo o que fazemos está adaptado à nossa realidade. Língua, preços, locais, horários — é tudo pensado para cá." },
  { title: "Aprendizagem mútua", text: "Não é só voluntariado — é uma comunidade de aprendizagem. O que fazes aqui vai para o teu portfólio." },
];

export default function TrabalhaConnoscoPage() {
  return (
    <>
      <section className="pt-28 lg:pt-36 pb-12 lg:pb-16 bg-ink text-bone relative overflow-hidden grain">
        <div
          aria-hidden
          className="absolute right-[-2rem] top-1/2 -translate-y-1/2 hangul-deco font-black text-bone/[0.04] select-none pointer-events-none leading-none"
          style={{ fontSize: "clamp(8rem, 22vw, 24rem)" }}
        >
          일
        </div>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 relative">
          <div className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-coral flex items-center gap-3 mb-4">
            <span className="inline-block w-6 h-px bg-coral" />
            <span>Parcerias / Equipa</span>
          </div>
          <h1
            className="font-display font-bold leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 9vw, 7rem)" }}
          >
            Constrói isto<br />
            <span className="italic text-coral">connosco.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-bone/70 leading-relaxed">
            A KM funciona graças a voluntários apaixonados. Se tens talento, tempo e amor pelo K-POP — há um lugar para ti.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 lg:py-20 bg-coral text-ink grain">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {values.map((v, i) => (
              <div key={v.title}>
                <div className="font-display font-black text-4xl lg:text-5xl text-ink/20 leading-none mb-4">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display font-bold text-xl lg:text-2xl leading-tight mb-2">
                  {v.title}
                </h3>
                <p className="text-sm sm:text-base text-ink/80 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-12 lg:mb-16">
            Posições em aberto
          </h2>

          <div className="space-y-12 lg:space-y-16">
            {roles.map((area) => (
              <div key={area.area}>
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-coral flex items-center gap-3 mb-6">
                  <span className="inline-block w-6 h-px bg-coral" />
                  {area.area}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
                  {area.positions.map((pos) => (
                    <div key={pos.title} className="group p-6 lg:p-8 border border-ink/15 hover:border-ink transition-colors flex flex-col">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <h3 className="font-display font-bold text-xl lg:text-2xl leading-tight">
                          {pos.title}
                        </h3>
                        <span className="shrink-0 bg-ink text-bone font-mono text-[10px] tracking-[0.2em] uppercase px-2.5 py-1">
                          {pos.type}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base text-ink/70 leading-relaxed flex-1">
                        {pos.desc}
                      </p>
                      <div className="mt-5 pt-4 border-t border-ink/10 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          {pos.skills.map((sk) => (
                            <span key={sk} className="font-mono text-[10px] tracking-[0.15em] uppercase border border-ink/20 px-2.5 py-1 text-ink/60">
                              {sk}
                            </span>
                          ))}
                        </div>
                        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/40">
                          {pos.commitment}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply CTA */}
      <section className="py-16 lg:py-24 bg-ink text-bone grain">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div>
              <h2 className="font-display font-bold leading-[0.92] tracking-tight text-4xl sm:text-5xl lg:text-6xl">
                Pronto para<br />
                <span className="italic text-coral">fazer parte?</span>
              </h2>
              <p className="mt-6 text-base sm:text-lg text-bone/70 leading-relaxed max-w-md">
                Envia-nos uma mensagem nas redes sociais com o teu interesse e área. Respondemos a todos os contactos.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <a
                  href="https://www.instagram.com/kpopmozambique_oficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-brutal"
                >
                  Contactar no Instagram
                  <ArrowUpRight size={14} />
                </a>
                <a
                  href="https://chat.whatsapp.com/HZwzHk4DOO67h6WLyDYKpK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-bone font-mono text-xs uppercase tracking-[0.15em] font-semibold hover:bg-bone hover:text-ink transition-colors"
                >
                  Grupo WhatsApp
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
            <div className="border border-bone/15 p-6 lg:p-8">
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/50 mb-4">
                Na tua candidatura, inclui
              </div>
              <ul className="space-y-3">
                {[
                  "O teu nome e cidade",
                  "A posição que te interessa",
                  "Uma frase sobre o teu amor pelo K-POP",
                  "Portfólio ou exemplo do teu trabalho (se aplicável)",
                  "Disponibilidade semanal",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-bone/80">
                    <span className="font-mono text-coral text-[10px] shrink-0 mt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
