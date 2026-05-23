"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Notícias", href: "/noticias", k: "01" },
  { label: "Eventos", href: "/eventos", k: "02" },
  { label: "Comunidade", href: "/comunidade", k: "03" },
  { label: "Talentos", href: "/talentos", k: "04" },
  { label: "Artistas", href: "/artistas", k: "05" },
  { label: "Marketplace", href: "/marketplace", k: "06" },
  { label: "Aprender", href: "/aprender", k: "07" },
];

// Routes whose first hero section has a dark (bg-ink) background.
// Header text will be bone/white while the page is at the top.
const DARK_HERO_ROUTES = [
  "/eventos",
  "/aprender",
  "/sobre",
  "/imprensa",
  "/trabalha-connosco",
  "/termos",
  "/privacidade",
  "/cookies",
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const hasDarkHero = DARK_HERO_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );
  const light = scrolled || !hasDarkHero;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-40 transition-all duration-300",
          scrolled ? "bg-bone/90 backdrop-blur-md border-b border-ink/10" : "bg-transparent"
        )}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className={cn(
            "flex items-center justify-between h-16 lg:h-20 transition-colors duration-300",
            light ? "text-ink" : "text-bone"
          )}>
            <Link href="/" className="flex items-center gap-2 group">
              <div className={cn(
                "relative w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center transition-colors duration-300",
                light ? "bg-ink" : "bg-coral"
              )}>
                <span className="hangul-deco text-bone text-lg lg:text-xl leading-none">K</span>
                <span className={cn(
                  "absolute -top-1 -right-1 w-2.5 h-2.5 transition-colors duration-300",
                  light ? "bg-coral" : "bg-bone"
                )} />
              </div>
              <div className="leading-none">
                <div className="font-display text-base lg:text-lg font-bold tracking-tight">
                  KPOP<span className="text-coral">.</span>MZ
                </div>
                <div className={cn(
                  "font-mono text-[9px] lg:text-[10px] tracking-[0.2em] mt-0.5 transition-colors duration-300",
                  light ? "text-ink/60" : "text-bone/60"
                )}>
                  COMUNIDADE OFICIAL
                </div>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="link-underline font-mono text-xs uppercase tracking-widest hover:text-coral transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/pesquisa"
                aria-label="Pesquisar"
                className={cn(
                  "hidden sm:flex w-9 h-9 lg:w-10 lg:h-10 border items-center justify-center transition-colors",
                  light
                    ? "border-ink hover:bg-ink hover:text-bone"
                    : "border-bone/60 hover:bg-bone hover:text-ink"
                )}
              >
                <Search size={16} strokeWidth={2} />
              </Link>
              <Link
                href="/comunidade"
                className="hidden lg:inline-flex btn-brutal"
              >
                Entrar na KM
              </Link>
              <button
                onClick={() => setOpen(true)}
                aria-label="Abrir menu"
                className={cn(
                  "lg:hidden w-9 h-9 sm:w-10 sm:h-10 border flex items-center justify-center transition-colors",
                  light ? "border-ink" : "border-bone/60"
                )}
              >
                <Menu size={18} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden transition-all duration-500",
          open ? "visible" : "invisible"
        )}
      >
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-ink/80 backdrop-blur-sm transition-opacity duration-500",
            open ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          className={cn(
            "absolute right-0 top-0 bottom-0 w-full sm:max-w-md bg-bone overflow-y-auto transition-transform duration-500 ease-out",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between px-5 h-16 border-b border-ink/10">
            <span className="font-mono text-xs tracking-[0.25em] uppercase">Menu</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
              className="w-10 h-10 border border-ink flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </div>
          <nav className="px-5 py-6">
            {navItems.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="group flex items-baseline gap-4 py-4 border-b border-ink/10 hover:pl-2 transition-all"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="font-mono text-[10px] tracking-[0.25em] text-ink/40 w-8">
                  {item.k}
                </span>
                <span className="font-display text-3xl sm:text-4xl font-semibold tracking-tight group-hover:text-coral transition-colors">
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
          <div className="px-5 pb-8 mt-4">
            <Link
              href="/comunidade"
              onClick={() => setOpen(false)}
              className="btn-brutal w-full justify-center"
            >
              Entrar na KM
            </Link>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/50 mt-6">
              Comunidade desde 2020
              <br />
              Maputo · Beira · Online
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
