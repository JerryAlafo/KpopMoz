"use client";

import { ArrowUpRight, Heart, MessageCircle } from "lucide-react";

const SOCIALS = [
  {
    label: "WhatsApp",
    sublabel: "+258 83 306 6530",
    url: "https://wa.me/258833066530",
    color: "#25D366",
    logo: "/social/whatsapp.png",
  },
  {
    label: "LinkedIn",
    sublabel: "Jerry de Jesus",
    url: "https://www.linkedin.com/in/jerry-de-jesus-gomes-alafo-53677b294/",
    color: "#0A66C2",
    logo: "/social/linkedin.png",
  },
  {
    label: "Instagram",
    sublabel: "@jerry_org_",
    url: "https://www.instagram.com/jerry_org_/",
    color: "#E4405F",
    logo: "/social/instagram.png",
  },
  {
    label: "Instagram Jobs",
    sublabel: "@jerry_org_jobs",
    url: "https://www.instagram.com/jerry_org_jobs/",
    color: "#F77737",
    logo: "/social/instagram.png",
  },
  {
    label: "YouTube",
    sublabel: "Jerry Org",
    url: "https://www.youtube.com/channel/UCKmIif3KVJKlHK7NcjhXWlg",
    color: "#FF0000",
    logo: "/social/youtube.png",
  },
  {
    label: "KPOP.MZ Instagram",
    sublabel: "@kpop.mz",
    url: "https://www.instagram.com/kpop.mz/",
    color: "#E4405F",
    logo: "/social/instagram.png",
  },
  {
    label: "KPOP.MZ TikTok",
    sublabel: "@kpop.mz",
    url: "https://www.tiktok.com/@kpop.mz",
    color: "#000000",
    logo: "/social/instagram.png",
  },
];

export default function SuporteClient() {
  return (
    <div className="min-h-screen bg-bone">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-none">
            Suporte / Criador
          </h1>
          <p className="mt-4 text-base text-ink/60 max-w-xl leading-relaxed">
            Precisa de ajuda ou quer dar feedback? Contacta-nos directamente ou
            une-te à comunidade.
          </p>
        </div>

        {/* Criador */}
        <div className="bg-ink text-bone p-6 lg:p-8 mb-8 grain">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-coral flex items-center justify-center font-display font-black text-xl text-ink shrink-0">
              JJ
            </div>
            <div>
              <h2 className="font-display font-bold text-xl">
                Jerry de Jesus Gomes Alafo
              </h2>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/50">
                Desenvolvedor da KPOP.MZ
              </p>
            </div>
          </div>
          <p className="text-sm text-bone/70 leading-relaxed max-w-lg">
            Desenvolvedor da plataforma. Bug reports, sugestões e parcerias são
            bem-vindos.
          </p>
        </div>

        {/* Redes sociais */}
        <h3 className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/40 mb-4">
          Redes sociais
        </h3>
        <div className="space-y-3">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-4 border border-ink/15 hover:border-ink hover:bg-ink hover:text-bone transition-all"
            >
              <div
                className="w-10 h-10 flex items-center justify-center shrink-0"
                style={{ background: `${s.color}1A` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.logo}
                  alt={s.label}
                  draggable={false}
                  width={24}
                  height={24}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold text-sm">
                  {s.label}
                </div>
                <div className="font-mono text-[10px] tracking-[0.15em] uppercase opacity-50">
                  {s.sublabel}
                </div>
              </div>
              <ArrowUpRight
                size={16}
                className="text-ink/30 group-hover:text-bone/50 transition-colors shrink-0"
              />
            </a>
          ))}
        </div>

        {/* Feedback */}
        <div className="mt-10 border border-ink/15 p-6">
          <div className="flex items-center gap-3 mb-3">
            <MessageCircle size={16} className="text-coral" />
            <h3 className="font-display font-bold text-sm">Feedback</h3>
          </div>
          <p className="text-sm text-ink/60 leading-relaxed">
            Encontraste um bug? Tens uma ideia para melhorar a plataforma?
            Junta-te ao nosso WhatsApp e manda mensagem.
          </p>
          <a
            href="https://chat.whatsapp.com/HZwzHk4DOO67h6WLyDYKpK"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 border border-ink px-5 py-3 font-mono text-xs uppercase tracking-[0.15em] hover:bg-ink hover:text-bone transition-colors"
          >
            Abrir WhatsApp
            <ArrowUpRight size={12} />
          </a>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-ink/10 flex items-center gap-2">
          <Heart size={12} className="text-coral" />
          <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/40">
            KPOP.MZ · Comunidade desde 2020
          </span>
        </div>
      </div>
    </div>
  );
}
