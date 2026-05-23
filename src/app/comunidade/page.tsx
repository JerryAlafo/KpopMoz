import Link from "next/link";
import { ArrowRight, Users, MessageSquare, Heart, Calendar, Sparkles, Trophy } from "lucide-react";

const fandoms = [
  { name: "ARMY", group: "BTS", members: 1842, color: "#7a2c5e" },
  { name: "BLINK", group: "BLACKPINK", members: 1234, color: "#ff3d68" },
  { name: "STAY", group: "Stray Kids", members: 612, color: "#0a0a0a" },
  { name: "ONCE", group: "TWICE", members: 543, color: "#ff5a82" },
  { name: "MOA", group: "TXT", members: 287, color: "#3a5cff" },
  { name: "EXO-L", group: "EXO", members: 421, color: "#1c1c1c" },
  { name: "CARAT", group: "SEVENTEEN", members: 356, color: "#ffd23f" },
  { name: "ATINY", group: "ATEEZ", members: 198, color: "#7af0c8" },
  { name: "Bunnies", group: "NewJeans", members: 312, color: "#7af0c8" },
  { name: "DIVE", group: "IVE", members: 245, color: "#ff3d68" },
];

const features = [
  {
    Icon: Users,
    title: "Perfil de fã",
    text: "Cria a tua identidade dentro da comunidade. Mostra os teus biases, os teus fandoms e o que produzes.",
  },
  {
    Icon: MessageSquare,
    title: "Fóruns por fandom",
    text: "Cada fandom tem o seu espaço. Conversa, partilha teorias, organiza listening parties.",
  },
  {
    Icon: Calendar,
    title: "Calendário pessoal",
    text: "Marca os eventos, comebacks, aniversários de bias e estreias que te interessam.",
  },
  {
    Icon: Heart,
    title: "Notificações",
    text: "Recebe avisos de lançamentos, eventos perto de ti e novos posts dos teus fandoms.",
  },
  {
    Icon: Sparkles,
    title: "Concursos e desafios",
    text: "Participa em quizzes, desafios de dança, votações e ganha destaque na plataforma.",
  },
  {
    Icon: Trophy,
    title: "Rankings",
    text: "Top fandom da semana, top criador, top participante - reconhecimento pelo que fazes.",
  },
];

export default function ComunidadePage() {
  return (
    <>
      {/* Hero with form */}
      <section className="pt-28 lg:pt-36 pb-12 lg:pb-20 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute left-[-3rem] top-1/2 -translate-y-1/2 hangul-deco font-black text-ink/[0.04] select-none pointer-events-none leading-none"
          style={{ fontSize: "clamp(8rem, 22vw, 24rem)" }}
        >
          가족
        </div>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-16">
            <div>
              <div className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-coral flex items-center gap-3 mb-4">
                <span className="inline-block w-6 h-px bg-coral" />
                <span>Secção 03 / Comunidade</span>
              </div>
              <h1 className="font-display font-bold leading-[0.9] tracking-tight"
                  style={{ fontSize: "clamp(2.75rem, 9vw, 8rem)" }}>
                Mais do que<br />
                <span className="italic text-coral">um grupo</span><br />
                de WhatsApp.
              </h1>
              <p className="mt-6 lg:mt-8 max-w-xl text-base sm:text-lg text-ink/75 leading-relaxed">
                Cria a tua conta, escolhe os teus fandoms, junta-te aos fóruns, marca
                os eventos no calendário e mostra o que produzes. Em português, sem
                ruído, contigo.
              </p>
            </div>

            {/* Sign-up card */}
            <div className="lg:sticky lg:top-28 self-start bg-ink text-bone p-6 lg:p-8 relative">
              <div className="absolute -top-3 -right-3 bg-coral text-ink px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] uppercase font-semibold">
                Grátis
              </div>
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-bone/60 mb-3">
                Criar conta KM
              </div>
              <h3 className="font-display font-bold text-2xl lg:text-3xl leading-tight">
                Bem-vindo à<br />comunidade.
              </h3>
              <div className="space-y-3 mt-6">
                <label className="block">
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/60">Nome</span>
                  <input
                    type="text"
                    placeholder="O teu nome"
                    className="w-full bg-transparent border-b border-bone/30 py-2 mt-1 focus:border-coral focus:outline-none transition-colors text-sm"
                  />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/60">Email</span>
                  <input
                    type="email"
                    placeholder="o.teu@email.mz"
                    className="w-full bg-transparent border-b border-bone/30 py-2 mt-1 focus:border-coral focus:outline-none transition-colors text-sm"
                  />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/60">Cidade</span>
                  <select
                    className="w-full bg-transparent border-b border-bone/30 py-2 mt-1 focus:border-coral focus:outline-none transition-colors text-sm text-bone/80"
                  >
                    <option className="text-ink">Maputo</option>
                    <option className="text-ink">Matola</option>
                    <option className="text-ink">Beira</option>
                    <option className="text-ink">Nampula</option>
                    <option className="text-ink">Outra</option>
                  </select>
                </label>
              </div>
              <button
                type="button"
                className="mt-6 w-full bg-coral text-ink font-mono text-xs tracking-[0.2em] uppercase font-semibold py-3 hover:bg-bone transition-colors inline-flex items-center justify-center gap-2"
              >
                Criar conta
                <ArrowRight size={14} />
              </button>
              <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-bone/40 mt-4 text-center">
                Já tens conta? <Link href="/entrar" className="text-coral hover:underline">Entrar</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fandoms */}
      <section className="py-16 lg:py-24 bg-ink text-bone grain">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-10 lg:mb-14">
            <div>
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/60 mb-3">
                Escolhe os teus
              </div>
              <h2 className="font-display font-bold leading-[0.95] tracking-tight text-4xl sm:text-5xl lg:text-6xl">
                Fandoms ativos em<br />Moçambique.
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
            {fandoms.map((f, i) => (
              <button
                key={f.name}
                className="group relative aspect-square p-4 lg:p-5 flex flex-col justify-between text-left transition-transform hover:-translate-y-1 grain"
                style={{ backgroundColor: f.color }}
              >
                <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/80">
                  {String(i + 1).padStart(2, "0")} / Fandom
                </div>
                <div>
                  <div className="font-display font-black text-bone leading-none text-3xl lg:text-4xl tracking-tight">
                    {f.name}
                  </div>
                  <div className="font-mono text-xs text-bone/80 mt-1.5">{f.group}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/60 mt-3">
                    {f.members.toLocaleString()} membros
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <h2 className="font-display font-bold leading-[0.95] tracking-tight text-4xl sm:text-5xl lg:text-6xl max-w-3xl">
            O que tens à <span className="italic text-coral">tua disposição</span>.
          </h2>
          <div className="mt-10 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 lg:gap-y-12">
            {features.map(({ Icon, title, text }, i) => (
              <div key={title} className="group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 border border-ink flex items-center justify-center group-hover:bg-coral group-hover:border-coral transition-colors">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <div className="font-display font-black text-3xl text-ink/15">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <h3 className="font-display font-bold text-xl lg:text-2xl leading-tight">
                  {title}
                </h3>
                <p className="mt-2 text-sm lg:text-base text-ink/70 leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
