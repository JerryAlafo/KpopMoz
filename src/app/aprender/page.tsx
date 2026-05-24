import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { BookOpen, Clock, ArrowUpRight, Languages, Globe, History } from "lucide-react";

const categories = [
  { name: "Glossário", Icon: BookOpen, desc: "Termos, expressões e siglas que vês todos os dias.", count: 12 },
  { name: "Cultura", Icon: Globe, desc: "Comportamentos de fandom, lore da indústria, etiqueta.", count: 8 },
  { name: "Língua", Icon: Languages, desc: "Hangul, frases úteis, expressões coreanas no quotidiano.", count: 14 },
  { name: "História", Icon: History, desc: "As cinco gerações, marcos e viragens da indústria.", count: 6 },
];

export default async function AprenderPage() {
  const { data } = await supabase
    .from("learn_topics")
    .select("id, slug, title, category, excerpt, duration, level")
    .order("created_at", { ascending: false });

  const topics = data ?? [];

  return (
    <>
      <section className="pt-28 lg:pt-36 pb-12 lg:pb-16 bg-ink text-bone relative overflow-hidden grain">
        <div
          aria-hidden
          className="absolute left-[-3rem] top-1/2 -translate-y-1/2 hangul-deco font-black text-bone/[0.04] select-none pointer-events-none leading-none"
          style={{ fontSize: "clamp(8rem, 22vw, 24rem)" }}
        >
          공부
        </div>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 relative">
          <div className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-coral flex items-center gap-3 mb-4">
            <span className="inline-block w-6 h-px bg-coral" />
            <span>Secção 07 / Aprender</span>
          </div>
          <h1
            className="font-display font-bold leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 9vw, 8rem)" }}
          >
            Cultura coreana
            <br />
            <span className="italic text-coral">em português,</span>
            <br />
            sem complicar.
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-bone/70 leading-relaxed">
            Glossário, alfabeto Hangul, história e cultura — escrito pela
            comunidade, para a comunidade, sempre adaptado ao que vivemos cá.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 lg:py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {categories.map(({ name, Icon, desc, count }, i) => (
              <Link
                key={name}
                href={`/pesquisa?q=${encodeURIComponent(name)}`}
                className="group relative p-6 lg:p-8 border border-ink hover:bg-ink hover:text-bone transition-colors flex flex-col"
              >
                <div className="flex items-start justify-between mb-6">
                  <Icon size={28} strokeWidth={1.5} />
                  <div className="font-display font-black text-4xl lg:text-5xl opacity-15 group-hover:opacity-30 transition-opacity">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <div className="font-display font-bold text-2xl lg:text-3xl leading-tight">
                  {name}
                </div>
                <p className="text-sm opacity-70 mt-2 leading-relaxed">{desc}</p>
                <div className="mt-6 pt-4 border-t border-current/20 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase">
                  <span>{count} artigos</span>
                  <ArrowUpRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest topics list */}
      <section className="py-12 lg:py-20 bg-bone-200/40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
            <h2 className="font-display font-bold leading-[0.95] tracking-tight text-3xl sm:text-4xl lg:text-5xl">
              Mais recentes
            </h2>
          </div>
          <div className="space-y-3">
            {topics.map((topic, i) => (
              <Link
                key={topic.id}
                href={`/aprender/${topic.slug}`}
                className="group flex items-center gap-4 lg:gap-8 p-4 lg:p-6 bg-bone border border-ink/10 hover:border-ink hover:bg-coral transition-all"
              >
                <div className="font-display font-black text-3xl lg:text-5xl leading-none opacity-25 group-hover:opacity-100 transition-opacity shrink-0 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 font-mono text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-ink/60 mb-1.5">
                    <span>{topic.category}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={10} /> {topic.duration}
                    </span>
                    <span>·</span>
                    <span>{topic.level}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg sm:text-xl lg:text-2xl leading-tight">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-ink/70 mt-1 line-clamp-1">
                    {topic.excerpt}
                  </p>
                </div>
                <ArrowUpRight size={20} className="opacity-30 group-hover:opacity-100 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hangul card */}
      <section className="py-16 lg:py-24 bg-coral text-ink grain">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase mb-4 flex items-center gap-3">
                <span className="inline-block w-6 h-px bg-ink" />
                <span>Aula rápida</span>
              </div>
              <h2 className="font-display font-bold leading-[0.92] tracking-tight text-4xl sm:text-5xl lg:text-6xl">
                Aprende a ler
                <br /> Hangul em{" "}
                <span className="italic">um fim de semana.</span>
              </h2>
              <p className="mt-6 text-base sm:text-lg text-ink/80 leading-relaxed max-w-md">
                14 consoantes, 10 vogais. Foi desenhado para ser aprendido em
                horas — tu fazes-lo em dois dias.
              </p>
              <Link
                href="/aprender/alfabeto-hangul-essencial"
                className="btn-brutal mt-8"
              >
                Começar curso
                <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {["가", "나", "다", "라", "마", "바", "사", "아", "자", "차", "카", "타"].map((c, i) => (
                <div
                  key={i}
                  className="aspect-square bg-ink text-bone flex items-center justify-center hangul-deco text-3xl sm:text-4xl font-bold hover:bg-bone hover:text-ink transition-colors cursor-default"
                >
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
