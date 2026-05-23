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
      <FeaturedNews />
      <EventsSection />
      <TalentsSection />
      <Marquee
        items={[
          "BTS · BLACKPINK · STRAY KIDS · NEWJEANS · TWICE · ATEEZ · IVE · SEVENTEEN · LE SSERAFIM · ENHYPEN · TXT · ITZY · AESPA · NMIXX · RIIZE",
        ]}
        invert
        speed="slow"
      />
      <ArtistsSection />
      <MarketplaceSection />
      <LearnSection />
      <AboutSection />
      <JoinCTA />
    </>
  );
}
