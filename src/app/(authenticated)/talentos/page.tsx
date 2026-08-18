"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, MapPin, Sparkles } from "lucide-react";
import type { Talent } from "@/types";

type Specialty = Talent["specialty"] | "Todos";

const TALENTS_PAGE_SIZE = 24;

const specialties: Specialty[] = [
  "Todos", "Dança", "Canto", "Edição", "Fanart", "Moda", "Cosplay",
];

function talentVisualStyle(talent: Talent) {
  if (!talent.imageUrl) return { background: talent.bg };

  return {
    backgroundImage: `linear-gradient(180deg, rgba(10,10,10,0.05), rgba(10,10,10,0.58)), url("${talent.imageUrl.replace(/["\\\n\r]/g, "")}")`,
    backgroundPosition: "center",
    backgroundSize: "cover",
  };
}

function TalentsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
        <div key={item} className="space-y-4 animate-pulse">
          <div className="aspect-[4/5] bg-ink/10" />
          <div className="h-5 w-3/4 bg-ink/10" />
          <div className="h-3 w-full bg-ink/10" />
          <div className="h-3 w-2/3 bg-ink/10" />
        </div>
      ))}
    </div>
  );
}

export default function TalentosPage() {
  const [active, setActive] = useState<Specialty>("Todos");
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    fetch(`/api/talents?limit=${TALENTS_PAGE_SIZE}&offset=0`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data?.items)) setTalents(data.items);
        setHasMore(Boolean(data?.hasMore));
      })
      .catch(() => {
        if (mounted) setHasMore(false);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => (
    active === "Todos" ? talents : talents.filter((talent) => talent.specialty === active)
  ), [active, talents]);

  async function loadMore() {
    if (loadingMore) return;

    setLoadingMore(true);
    try {
      const response = await fetch(`/api/talents?limit=${TALENTS_PAGE_SIZE}&offset=${talents.length}`, {
        cache: "no-store",
      });
      const data = response.ok ? await response.json() : null;
      const incoming = Array.isArray(data?.items) ? data.items as Talent[] : [];

      setTalents((current) => {
        const seen = new Set(current.map((item) => item.id));
        return current.concat(incoming.filter((item) => !seen.has(item.id)));
      });
      setHasMore(Boolean(data?.hasMore) && incoming.length > 0);
    } catch {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <>
      <section className="pt-28 lg:pt-36 pb-12 lg:pb-16 bg-bone-200/40 border-b border-ink/15">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-coral flex items-center gap-3 mb-4">
            <span className="inline-block w-6 h-px bg-coral" />
            <span>Secção 04 / Talentos</span>
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
            Bailarinos, cantores, beatmakers e criadores moçambicanos que vivem
            o K-POP todos os dias. Clica em ver mais para descobrir novos perfis.
          </p>
          <div className="mt-10 flex flex-wrap gap-2">
            {specialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => setActive(specialty)}
                className={`px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] border transition-colors ${active === specialty
                  ? "bg-ink text-bone border-ink"
                  : "border-ink/30 hover:border-ink hover:bg-ink hover:text-bone"
                  }`}
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          {loading ? (
            <TalentsLoading />
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="font-display font-black text-6xl text-ink/10 mb-4">0</div>
              <p className="font-display font-bold text-2xl text-ink/50">
                Sem talentos para mostrar agora.
              </p>
              <p className="mt-3 max-w-xl mx-auto font-mono text-sm text-ink/40 tracking-wide">
                Tenta outra especialidade ou explora outros perfis.
              </p>
              {hasMore && (
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="mt-8 inline-flex items-center justify-center gap-2 border border-ink px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] hover:bg-ink hover:text-bone transition-colors disabled:opacity-50"
                >
                  {loadingMore ? "A carregar..." : "Ver mais talentos"}
                  <ArrowUpRight size={13} />
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
                {filtered.map((talent, index) => (
                  <Link
                    key={talent.id}
                    href={`/talentos/${talent.slug}`}
                    className="group flex flex-col card-tilt"
                  >
                    <div
                      className="relative aspect-[4/5] overflow-hidden grain bg-ink"
                      style={talentVisualStyle(talent)}
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
                          {String(index + 1).padStart(2, "0")}
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
                        {typeof talent.followers === "number" && (
                          <span>{talent.followers.toLocaleString("pt")} seguidores</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {hasMore && (
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="inline-flex items-center justify-center gap-2 border border-ink px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] hover:bg-ink hover:text-bone transition-colors disabled:opacity-50"
                  >
                    {loadingMore ? "A carregar..." : "Ver mais talentos"}
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

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
                Envia o teu perfil e a nossa equipa analisa. Se aprovado, ficas
                visível para toda a comunidade.
              </p>
              <a
                href="mailto:kpopmozambique@gmail.com?subject=Submeter%20perfil%20de%20talento&body=Nome%3A%0AUsername%3A%0ACidade%3A%0AEspecialidade%3A%0ALinks%20ou%20portfolio%3A%0ABio%3A"
                className="btn-brutal mt-8 inline-flex"
              >
                Submeter perfil
                <ArrowUpRight size={14} />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {specialties.filter((item) => item !== "Todos").map((specialty, index) => (
                <button
                  key={specialty}
                  onClick={() => setActive(specialty)}
                  className="aspect-square border border-bone/15 p-5 flex flex-col justify-between hover:border-coral transition-colors group"
                >
                  <div className="font-display font-black text-3xl lg:text-4xl text-bone/30 group-hover:text-coral/40 transition-colors">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="font-display font-bold text-xl lg:text-2xl text-left">
                    {specialty}
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
