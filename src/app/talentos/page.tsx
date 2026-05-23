"use client";

import { useState } from "react";
import Link from "next/link";
import { talents } from "@/data/talents";
import { MapPin, Sparkles, ArrowUpRight } from "lucide-react";
import type { Talent } from "@/types";

type Specialty = Talent["specialty"] | "Todos";

const specialties: Specialty[] = [
  "Todos", "Dança", "Canto", "Edição", "Fanart", "Moda", "Cosplay",
];

export default function TalentosPage() {
  const [active, setActive] = useState<Specialty>("Todos");

  const filtered =
    active === "Todos" ? talents : talents.filter((t) => t.specialty === active);

  return (
    <>
      <section className="pt-28 lg:pt-36 pb-12 lg:pb-16 bg-bone-200/40 border-b border-ink/15">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-coral flex items-center gap-3 mb-4">
            <span className="inline-block w-6 h-px bg-coral" />
            <span>Secção 04 / Talentos locais</span>
          </div>
          <h1
            className="font-display font-bold leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 9vw, 8rem)" }}
          >
            Quem brilha
            <br />
            <span className="italic text-coral">no nosso</span> terreno.
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-ink/70 leading-relaxed">
            Dançarinos, cantores, editores, ilustradores, stylists, cosplayers — a
            geração de criadores moçambicanos que estão a redefinir o que significa
            ser fã.
          </p>
          <div className="mt-10 flex flex-wrap gap-2">
            {specialties.map((s) => (
              <button
                key={s}
                onClick={() => setActive(s)}
                className={`px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] border transition-colors ${
                  active === s
                    ? "bg-ink text-bone border-ink"
                    : "border-ink/30 hover:border-ink hover:bg-ink hover:text-bone"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="font-display font-black text-6xl text-ink/10 mb-4">0</div>
              <p className="font-display font-bold text-2xl text-ink/50">
                Sem talentos nesta especialidade por agora.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
              {filtered.map((talent, i) => (
                <Link
                  key={talent.id}
                  href={`/talentos/${talent.slug}`}
                  className="group flex flex-col card-tilt"
                >
                  <div
                    className="relative aspect-[4/5] overflow-hidden grain"
                    style={{ background: talent.bg }}
                  >
                    <div
                      className="absolute inset-0 mix-blend-overlay opacity-40"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(0deg, rgba(0,0,0,.08) 0 1px, transparent 1px 8px)",
                      }}
                    />
                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                      <span className="bg-ink text-bone font-mono text-[10px] uppercase tracking-[0.2em] px-2.5 py-1">
                        {talent.specialty}
                      </span>
                      {talent.featured && (
                        <div className="bg-coral text-ink p-1.5">
                          <Sparkles size={12} strokeWidth={1.75} />
                        </div>
                      )}
                    </div>
                    <div className="absolute left-3 right-3 bottom-3">
                      <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/80">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <h3 className="font-display font-bold text-xl sm:text-2xl text-bone leading-tight mt-1 group-hover:text-coral transition-colors">
                        {talent.name}
                      </h3>
                      <div className="font-mono text-xs text-bone/80 mt-0.5">
                        {talent.username}
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 space-y-3">
                    <p className="text-sm text-ink/70 line-clamp-3 leading-relaxed">
                      {talent.bio}
                    </p>
                    <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase text-ink/60 pt-2 border-t border-ink/15">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={11} /> {talent.city}
                      </span>
                      <span>{talent.followers.toLocaleString()} seguidores</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA - Submit */}
      <section className="py-16 lg:py-24 bg-ink text-bone grain">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-coral mb-4">
                <span className="inline-block w-6 h-px bg-coral align-middle mr-3" />
                Submete-te
              </div>
              <h2 className="font-display font-bold leading-[0.92] tracking-tight text-4xl sm:text-5xl lg:text-6xl">
                Tens um talento
                <br /> ligado ao K-POP?
              </h2>
              <p className="mt-6 text-base sm:text-lg text-bone/70 max-w-lg leading-relaxed">
                Submete o teu perfil para a curadoria da KM e ganha destaque no
                feed da plataforma, em eventos físicos e nas nossas redes sociais.
              </p>
              <button
                className="btn-brutal mt-8"
                style={{ background: "#ff3d68", borderColor: "#ff3d68", color: "#0a0a0a" }}
              >
                Submeter perfil
                <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {["Dança", "Canto", "Fanart", "Edição", "Moda", "Cosplay"].map((s, i) => (
                <button
                  key={s}
                  onClick={() => setActive(s as Specialty)}
                  className="aspect-square border border-bone/15 p-5 flex flex-col justify-between hover:border-coral transition-colors group"
                >
                  <div className="font-display font-black text-3xl lg:text-4xl text-bone/30 group-hover:text-coral/40 transition-colors">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="font-display font-bold text-xl lg:text-2xl text-left">
                    {s}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
