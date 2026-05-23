import Link from "next/link";
import { news } from "@/data/news";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function FeaturedNews() {
  const featured = news.find((n) => n.featured) ?? news[0];
  const secondary = news.filter((n) => n.id !== featured.id).slice(0, 4);

  return (
    <section className="py-16 lg:py-24 bg-bone">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <SectionHeader
          number="01"
          eyebrow="Notícias"
          title="O que mexe no K-POP esta semana"
          description="Curado pela equipa KM para a comunidade moçambicana - sem ruído, sem rumores soltos."
          link={{ href: "/noticias", label: "Todas as notícias" }}
        />

        <div className="mt-10 lg:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Featured */}
          <Link
            href={`/noticias/${featured.slug}`}
            className="lg:col-span-7 group block"
          >
            <div
              className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[5/4] overflow-hidden grain"
              style={{ background: featured.imageBg }}
            >
              <div className="absolute inset-0 mix-blend-overlay opacity-50"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, rgba(0,0,0,.1) 0 2px, transparent 2px 18px)",
                }}
              />
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-col gap-1.5">
                <span className="inline-block bg-ink text-bone font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] px-3 py-1.5 w-fit">
                  Destaque
                </span>
                <span className="inline-block bg-bone text-ink font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] px-3 py-1.5 w-fit">
                  {featured.category}
                </span>
              </div>
              <div className="absolute right-4 bottom-4 sm:right-6 sm:bottom-6 outline-number font-display font-black text-bone leading-none text-[6rem] sm:text-[9rem] lg:text-[12rem]">
                01
              </div>
            </div>
            <div className="mt-5 lg:mt-6">
              <h3 className="font-display font-bold tracking-tight leading-[1.05] text-2xl sm:text-3xl lg:text-4xl group-hover:text-coral transition-colors">
                {featured.title}
              </h3>
              <p className="text-ink/70 mt-3 text-base sm:text-lg leading-relaxed max-w-2xl">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-4 mt-4 font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-ink/60">
                <span>{featured.author}</span>
                <span>·</span>
                <span>{formatDate(featured.publishedAt)}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={11} /> {featured.readingTime} min
                </span>
              </div>
            </div>
          </Link>

          {/* Secondary news */}
          <div className="lg:col-span-5 flex flex-col">
            {secondary.map((item, i) => (
              <Link
                key={item.id}
                href={`/noticias/${item.slug}`}
                className="group flex gap-4 py-5 border-b border-ink/10 first:pt-0 first:lg:pt-0 last:border-b-0"
              >
                <div
                  className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 relative grain"
                  style={{ background: item.imageBg }}
                >
                  <div className="absolute inset-0 flex items-center justify-center font-display font-black text-bone/80 text-2xl">
                    {String(i + 2).padStart(2, "0")}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-ink/50">
                    {item.category} · {formatDate(item.publishedAt)}
                  </div>
                  <h4 className="font-display font-semibold text-base sm:text-lg leading-snug mt-1.5 group-hover:text-coral transition-colors line-clamp-3">
                    {item.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
