import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Imprensa — KPOP.MZ",
  description: "Recursos de imprensa e contacto para media sobre a KpopMoçambique.",
};

const pressItems = [
  {
    outlet: "Jornal O País",
    headline: "K-POP conquista jovens moçambicanos com festivais e cultura coreana",
    date: "Março 2025",
    type: "Print / Digital",
  },
  {
    outlet: "STV Moçambique",
    headline: "Festival K-POP Moçambique reúne centenas de fãs na Faculdade Joaquim Chissano",
    date: "Setembro 2025",
    type: "Televisão",
  },
  {
    outlet: "Rádio Moçambique",
    headline: "Entrevista: Como a comunidade K-POP cresceu de um grupo de WhatsApp para um fenómeno nacional",
    date: "Janeiro 2026",
    type: "Rádio",
  },
  {
    outlet: "Tempo Magazine",
    headline: "Geração Z moçambicana reinventa identidade cultural através do K-POP",
    date: "Fevereiro 2026",
    type: "Revista",
  },
];

const contacts = [
  { role: "Imprensa & Media", email: "imprensa@kpopmz.co.mz" },
  { role: "Parcerias institucionais", email: "parcerias@kpopmz.co.mz" },
  { role: "Redes sociais", handle: "@kpopmozambique_oficial" },
];

export default async function ImprensaPage() {
  const [{ count: membersCount }, { count: eventsCount }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }),
  ]);
  const membersNum = membersCount != null && membersCount >= 1000
    ? `${Math.floor(membersCount / 1000)} ${String(membersCount % 1000).padStart(3, "0")}+`
    : `${membersCount ?? 0}+`;
  const eventsNum = eventsCount != null ? `${eventsCount}+` : "—";

  const stats = [
    { value: "6+", label: "Anos de comunidade" },
    { value: membersNum, label: "Membros ativos" },
    { value: eventsNum, label: "Eventos realizados" },
    { value: "2", label: "Festivais institucionais" },
  ];

  return (
    <>
      <section className="pt-28 lg:pt-36 pb-12 lg:pb-16 bg-ink text-bone relative overflow-hidden grain">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 relative">
          <div className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-coral flex items-center gap-3 mb-4">
            <span className="inline-block w-6 h-px bg-coral" />
            <span>Parcerias / Imprensa</span>
          </div>
          <h1
            className="font-display font-bold leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 9vw, 7rem)" }}
          >
            Sala de<br />
            <span className="italic text-coral">Imprensa.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-bone/70 leading-relaxed">
            Recursos para jornalistas, bloggers e criadores de conteúdo que queiram cobrir a maior comunidade K-POP de Moçambique.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 lg:py-16 bg-coral text-ink">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display font-black leading-none tracking-tighter"
                  style={{ fontSize: "clamp(2rem, 6vw, 5rem)" }}>
                  {s.value}
                </div>
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/70 mt-2">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20">
            <div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight mb-6">
                Sobre a KpopMoçambique
              </h2>
              <div className="space-y-4 text-base sm:text-lg text-ink/80 leading-relaxed">
                <p>
                  A KpopMoçambique (KM) é a maior comunidade de K-POP de Moçambique, fundada em 2020 por um grupo de fãs de Maputo. Em seis anos, crescemos de um grupo de WhatsApp para uma organização com presença física em Maputo, Beira e Nampula.
                </p>
                <p>
                  Organizamos eventos mensais de Random Dance, Cover Dance Showcases e — desde 2022 — o K-POP Festival Moçambique, realizado em parceria com a Embaixada da República da Coreia do Sul em Moçambique e a Faculdade de Artes e Comunicação Joaquim Chissano.
                </p>
                <p>
                  A plataforma digital KPOP.MZ, lançada em 2026, é o ecossistema online da comunidade: notícias, eventos, talentos locais, marketplace e recursos educativos sobre cultura coreana, inteiramente em Português.
                </p>
              </div>
              <Link href="/sobre" className="btn-brutal mt-8 inline-flex">
                História completa
                <ArrowUpRight size={14} />
              </Link>
            </div>

            {/* Press clips */}
            <div>
              <h3 className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink/50 mb-6">
                Cobertura mediática (seleção)
              </h3>
              <div className="space-y-4">
                {pressItems.map((p, i) => (
                  <div key={i} className="p-5 border border-ink/15 hover:border-ink transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-coral">
                        {p.outlet}
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/40 shrink-0">
                        {p.type}
                      </span>
                    </div>
                    <p className="font-display font-semibold text-base sm:text-lg leading-snug">
                      {p.headline}
                    </p>
                    <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/50 mt-2">
                      {p.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 lg:py-20 bg-ink text-bone grain">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-10">
            Contacto para<br />
            <span className="italic text-coral">media.</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6">
            {contacts.map((c) => (
              <div key={c.role} className="p-6 border border-bone/15">
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-bone/50 mb-3">
                  {c.role}
                </div>
                <div className="font-display font-bold text-lg sm:text-xl text-coral">
                  {c.email ?? c.handle}
                </div>
              </div>
            ))}
          </div>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/40 mt-8">
            Respondemos a pedidos de imprensa dentro de 48 horas úteis.
          </p>
        </div>
      </section>
    </>
  );
}
