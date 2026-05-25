"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Instagram, MessageCircle, Youtube, Facebook } from "lucide-react";

const linkColumns = [
  {
    title: "Explorar",
    links: [
      { label: "Notícias", href: "/noticias" },
      { label: "Eventos", href: "/eventos" },
      { label: "Comunidade", href: "/comunidade" },
      { label: "Talentos", href: "/talentos" },
    ],
  },
  {
    title: "Conhecer",
    links: [
      { label: "Artistas", href: "/artistas" },
      { label: "Marketplace", href: "/marketplace" },
      { label: "Aprender", href: "/aprender" },
      { label: "Sobre a KM", href: "/sobre" },
    ],
  },
  {
    title: "Parcerias",
    links: [
      { label: "Embaixada da Coreia", href: "/sobre" },
      { label: "Sponsors", href: "/sobre" },
      { label: "Imprensa", href: "/imprensa" },
      { label: "Trabalha connosco", href: "/trabalha-connosco" },
    ],
  },
];

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/kpopmozambique_oficial/", Icon: Instagram },
  { label: "WhatsApp", href: "https://chat.whatsapp.com/HZwzHk4DOO67h6WLyDYKpK", Icon: MessageCircle },
  { label: "Facebook", href: "https://www.facebook.com/groups/455895496186020/", Icon: Facebook },
  { label: "YouTube", href: "https://www.youtube.com/@K-POPMOZAMBIQUE", Icon: Youtube },
];

export function Footer() {
  const pathname = usePathname();

  // Não mostrar footer no feed, entrar e onboarding
  const hidden = ["/conta/feed", "/entrar", "/onboarding"];
  if (hidden.some((p) => pathname === p || pathname.startsWith(p + "/"))) return null;

  return (
    <footer className="bg-ink text-bone relative overflow-hidden grain">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
              <Image src="/favicon.png" alt="KPOP.MZ" width={48} height={48} className="w-12 h-12 object-contain" />
              <div className="leading-none">
                <div className="font-display text-2xl font-bold">
                  KPOP<span className="text-coral">.</span>MZ
                </div>
                <div className="font-mono text-[10px] tracking-[0.2em] text-bone/50 mt-1">
                  COMUNIDADE OFICIAL
                </div>
              </div>
            </Link>
            <p className="text-bone/70 text-sm leading-relaxed max-w-sm">
              O ecossistema digital da comunidade K-POP em Moçambique. Notícias,
              eventos, talentos e cultura coreana, adaptada à nossa realidade desde
              2020.
            </p>
            <div className="flex gap-2 mt-6">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-bone/20 hover:border-coral hover:text-coral flex items-center justify-center transition-colors"
                >
                  <Icon size={16} strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>

          {linkColumns.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-[10px] tracking-[0.25em] uppercase text-bone/50 mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-coral transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Massive wordmark */}
      <div className="overflow-hidden border-t border-bone/10">
        <h2
          className="font-display font-black tracking-tighter leading-none text-center select-none"
          style={{ fontSize: "clamp(4rem, 22vw, 22rem)" }}
        >
          KPOP<span className="text-coral">·</span>MZ
        </h2>
      </div>

      <div className="border-t border-bone/10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between font-mono text-[10px] tracking-[0.2em] uppercase text-bone/50">
          <div>© 2026 KpopMoçambique · Todos os direitos reservados</div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/termos" className="hover:text-coral">Termos</Link>
            <Link href="/privacidade" className="hover:text-coral">Privacidade</Link>
            <Link href="/cookies" className="hover:text-coral">Cookies</Link>
            <span>Maputo · Moçambique</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
