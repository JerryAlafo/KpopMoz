import Link from "next/link";
import { talents } from "@/data/talents";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { MapPin, Sparkles } from "lucide-react";

export function TalentsSection() {
  const featured = talents.filter((t) => t.featured).slice(0, 3);
  const others = talents.filter((t) => !t.featured).slice(0, 4);

  return (
    <section className="py-16 lg:py-24 bg-bone">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <SectionHeader
          number="03"
          eyebrow="Spotlight"
          title="Talentos moçambicanos a brilhar"
          description="Quem dança, canta, edita, ilustra e cria moda inspirada no K-POP cá no nosso terreno."
          link={{ href: "/talentos", label: "Ver todos os talentos" }}
        />

        <div className="mt-10 lg:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {featured.map((talent, i) => (
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
                <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                  <span className="bg-ink text-bone font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5">
                    {talent.specialty}
                  </span>
                  <Sparkles size={16} className="text-bone" strokeWidth={1.75} />
                </div>
                <div className="absolute left-4 right-4 bottom-4">
                  <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/80">
                    {String(i + 1).padStart(2, "0")} / Featured
                  </div>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-bone leading-tight mt-1">
                    {talent.name}
                  </h3>
                  <div className="font-mono text-xs text-bone/80 mt-1">
                    {talent.username}
                  </div>
                </div>
              </div>
              <div className="pt-5 space-y-3">
                <p className="text-sm text-ink/70 line-clamp-3 leading-relaxed">
                  {talent.bio}
                </p>
                <div className="flex items-center gap-4 font-mono text-[10px] tracking-[0.2em] uppercase text-ink/60">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={11} /> {talent.city}
                  </span>
                  <span>{talent.followers.toLocaleString()} seguidores</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Other talents list */}
        <div className="mt-10 lg:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {others.map((talent) => (
            <Link
              key={talent.id}
              href={`/talentos/${talent.slug}`}
              className="group p-4 lg:p-5 border border-ink/15 hover:border-ink hover:bg-ink hover:text-bone transition-all"
            >
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase opacity-60 mb-2">
                {talent.specialty}
              </div>
              <div className="font-display font-bold text-lg lg:text-xl leading-tight">
                {talent.name}
              </div>
              <div className="font-mono text-xs opacity-60 mt-1">{talent.username}</div>
              <div className="mt-3 pt-3 border-t border-current/15 flex justify-between font-mono text-[10px] tracking-[0.2em] uppercase opacity-70">
                <span>{talent.city}</span>
                <span>{talent.works} obras</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
