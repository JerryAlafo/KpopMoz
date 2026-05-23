import { Suspense } from "react";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/shared/Marquee";
import { FeaturedNews } from "@/components/home/FeaturedNews";
import { EventsSection } from "@/components/home/EventsSection";
import { TalentsSection } from "@/components/home/TalentsSection";
import { ArtistsSection } from "@/components/home/ArtistsSection";
import { MarketplaceSection } from "@/components/home/MarketplaceSection";
import { LearnSection } from "@/components/home/LearnSection";
import { AboutSection } from "@/components/home/AboutSection";
import { JoinCTA } from "@/components/home/JoinCTA";

function FeaturedNewsLoading() {
  return (
    <section className="py-16 lg:py-24 bg-bone">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="h-3 w-28 bg-ink/10 animate-pulse" />
        <div className="mt-4 h-10 w-full max-w-xl bg-ink/10 animate-pulse" />
        <div className="mt-10 lg:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-7 space-y-5">
            <div className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[5/4] bg-ink/10 animate-pulse" />
            <div className="h-8 w-5/6 bg-ink/10 animate-pulse" />
            <div className="h-4 w-2/3 bg-ink/10 animate-pulse" />
          </div>
          <div className="lg:col-span-5 space-y-4">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="flex gap-4 py-5 border-b border-ink/10">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-ink/10 animate-pulse" />
                <div className="flex-1 space-y-3">
                  <div className="h-2 w-24 bg-ink/10 animate-pulse" />
                  <div className="h-4 w-4/5 bg-ink/10 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CatalogSectionLoading({ tone = "light" }: { tone?: "light" | "coral" }) {
  const dark = tone === "coral";

  return (
    <section className={`py-16 lg:py-24 ${dark ? "bg-coral" : "bg-bone"}`}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="h-3 w-28 bg-ink/10 animate-pulse" />
        <div className="mt-4 h-10 w-full max-w-xl bg-ink/10 animate-pulse" />
        <div className="mt-10 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="space-y-3">
              <div className="aspect-square bg-ink/10 animate-pulse" />
              <div className="h-5 w-3/4 bg-ink/10 animate-pulse" />
              <div className="h-3 w-1/2 bg-ink/10 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const tickerItems = [
  "Random Dance Maputo · 08 Junho",
  "Cover Dance Beira · 15 Junho",
  "Festival KPOP MZ · 20 Setembro",
  "Workshop Coreano · 22 Junho",
  "Encontro ARMY · 13 Julho",
  "Concurso Fanart · Submissões abertas",
];

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee items={tickerItems} />
      <Suspense fallback={<FeaturedNewsLoading />}>
        <FeaturedNews />
      </Suspense>
      <EventsSection />
      <Suspense fallback={<CatalogSectionLoading />}>
        <TalentsSection />
      </Suspense>
      <Marquee
        items={[
          "BTS · BLACKPINK · STRAY KIDS · NEWJEANS · TWICE · ATEEZ · IVE · SEVENTEEN · LE SSERAFIM · ENHYPEN · TXT · ITZY · AESPA · NMIXX · RIIZE",
        ]}
        invert
        speed="slow"
      />
      <Suspense fallback={<CatalogSectionLoading tone="coral" />}>
        <ArtistsSection />
      </Suspense>
      <MarketplaceSection />
      <LearnSection />
      <AboutSection />
      <JoinCTA />
    </>
  );
}
