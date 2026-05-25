import Image from "next/image";
import Link from "next/link";

const moments = [
  {
    src: "/WhatsApp Image 2026-05-25 at 12.28.52.jpeg",
    alt: "Membros da comunidade reunidos num encontro passado",
    className: "lg:col-span-7 aspect-[16/10]",
    sizes: "(min-width: 1024px) 54vw, 100vw",
  },
  {
    src: "/WhatsApp Image 2026-05-25 at 12.28.53 (1).jpeg",
    alt: "Pulseiras de participantes juntas em sinal de comunidade",
    className: "lg:col-span-5 aspect-[4/5]",
    sizes: "(min-width: 1024px) 38vw, 100vw",
  },
  {
    src: "/WhatsApp Image 2026-05-25 at 12.28.53.jpeg",
    alt: "Membros mostram as pulseiras de um evento passado",
    className: "lg:col-span-5 aspect-[4/5]",
    sizes: "(min-width: 1024px) 38vw, 100vw",
  },
  {
    src: "/WhatsApp Image 2026-05-25 at 12.28.54.jpeg",
    alt: "Grupo de membros durante um encontro da comunidade",
    className: "lg:col-span-7 aspect-[16/10]",
    sizes: "(min-width: 1024px) 54vw, 100vw",
  },
];

export function CommunityMoments() {
  return (
    <section className="py-16 lg:py-24 bg-bone">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-coral flex items-center gap-3 mb-4">
              <span className="inline-block w-6 h-px bg-coral" />
              <span>We Love Asia</span>
            </div>
            <h2 className="font-display font-bold leading-[0.95] tracking-tight text-4xl sm:text-5xl lg:text-6xl">
              Cada encontro<br />
              <span className="italic text-coral">é nosso.</span>
            </h2>
            <div className="mt-6 lg:mt-8 space-y-4 text-base sm:text-lg text-ink/75 leading-relaxed">
              <p>
                A forca da We Love Asia esta na presenca de todos em cada evento.
                E a energia dos membros que transforma qualquer encontro numa
                verdadeira festa.
              </p>
              <p>
                Aqui debatemos doramas, teorias de K-pop, anime e filmes, rimos
                juntos e cantamos no karaoke. E aquele calor de familia onde ninguem
                fica de fora.
              </p>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/eventos" className="btn-brutal">
                Ver eventos
              </Link>
              <Link
                href="/conta/feed"
                className="inline-flex items-center justify-center border border-ink px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] hover:bg-ink hover:text-bone transition-colors"
              >
                Entrar no feed
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4">
            {moments.map((photo) => (
              <figure
                key={photo.src}
                className={`relative overflow-hidden bg-ink/10 ${photo.className}`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes={photo.sizes}
                  className="object-cover"
                />
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
