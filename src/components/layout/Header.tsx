"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Search, LogOut, User, Grid3X3, Newspaper, Calendar, Mic2, Music, ShoppingBag, BookOpen, Rss, LayoutDashboard, Heart, HeartHandshake, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth";

const publicNavItems = [
  { label: "Notícias",    href: "/noticias",    k: "01" },
  { label: "Eventos",     href: "/eventos",     k: "02" },
  { label: "Comunidade",  href: "/",            k: "03" },
  { label: "Talentos",    href: "/talentos",    k: "04" },
  { label: "Artistas",    href: "/artistas",    k: "05" },
  { label: "Marketplace", href: "/marketplace", k: "06" },
  { label: "Aprender",    href: "/aprender",    k: "07" },
];

const privateNavItems = [
  { label: "Feed",        href: "/feed",        k: "01" },
  { label: "Notícias",    href: "/noticias",    k: "02" },
  { label: "Eventos",     href: "/eventos",     k: "03" },
  { label: "Artistas",    href: "/artistas",    k: "04" },
  { label: "Marketplace", href: "/marketplace", k: "05" },
  { label: "Aprender",    href: "/aprender",    k: "06" },
];

const allPrivateLinks = [
  { label: "Feed",        href: "/feed",        icon: Rss },
  { label: "Notícias",    href: "/noticias",    icon: Newspaper },
  { label: "Eventos",     href: "/eventos",     icon: Calendar },
  { label: "Artistas",    href: "/artistas",    icon: Mic2 },
  { label: "Talentos",    href: "/talentos",    icon: Music },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { label: "Aprender",    href: "/aprender",    icon: BookOpen },
  { label: "Dashboard",   href: "/dashboard",   icon: LayoutDashboard },
  { label: "Favoritos",   href: "/favoritos",   icon: Heart },
  { label: "Pesquisa",    href: "/pesquisa",    icon: Search },
  { label: "Suporte",     href: "/suporte",     icon: HeartHandshake },
];

const DARK_HERO_ROUTES = [
  "/sobre", "/imprensa", "/trabalha-connosco",
  "/termos", "/privacidade", "/cookies",
];

export function Header() {
  const [open, setOpen]               = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [moreOpen, setMoreOpen]       = useState(false);
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, logout } = useAuth();

  const hasDarkHero = DARK_HERO_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );
  const light = scrolled || !hasDarkHero;

  const navItems = user ? privateNavItems : publicNavItems;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open || moreOpen ? "hidden" : "";
  }, [open, moreOpen]);

  useEffect(() => { setAccountOpen(false); }, [pathname]);

  function handleLogout() {
    logout();
    setAccountOpen(false);
    setOpen(false);
    setMoreOpen(false);
    router.push("/");
  }

  const initials = user
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")
    : "";

  // Esconde header nas páginas de auth e onboarding
  if (pathname === "/entrar" || pathname === "/onboarding") return null;

  // Esconde header nas páginas protegidas (têm sidebar própria)
  const PROTECTED_PREFIXES = ["/feed", "/dashboard", "/eventos", "/noticias", "/artistas", "/aprender", "/marketplace", "/musicas", "/talentos", "/pesquisa", "/post", "/perfil", "/favoritos", "/admin", "/suporte"];
  if (PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) return null;

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
            {/* Logo */}
            <Link href={user ? "/feed" : "/"} className="flex items-center gap-2.5 group">
              <Image
                src="/favicon.png"
                alt="KPOP.MZ"
                width={40}
                height={40}
                className="w-9 h-9 lg:w-10 lg:h-10 object-contain"
                priority
              />
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

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "link-underline font-mono text-xs uppercase tracking-widest hover:text-coral transition-colors",
                    item.href === "/feed" && user && "text-coral font-semibold"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
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

              {user ? (
                <div className="hidden lg:block relative">
                  <button
                    onClick={() => setAccountOpen((v) => !v)}
                    className="flex items-center gap-2.5 border px-3 py-2 transition-colors font-mono text-xs uppercase tracking-[0.15em] border-coral bg-coral text-bone hover:bg-coral/80"
                  >
                    <span className="w-6 h-6 bg-bone/20 text-bone flex items-center justify-center font-bold text-[11px]">
                      {initials}
                    </span>
                    {user.name.split(" ")[0]}
                  </button>
                  {accountOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-bone border border-ink shadow-lg z-50">
                      <div className="px-4 py-3 border-b border-ink/10 bg-ink/5">
                        <div className="font-display font-semibold text-sm">{user.name}</div>
                        <div className="font-mono text-[9px] text-ink/40">{user.username}</div>
                      </div>
                      <Link
                        href="/feed"
                        className="flex items-center gap-3 px-4 py-3 font-mono text-xs uppercase tracking-[0.15em] hover:bg-ink hover:text-bone transition-colors border-b border-ink/10"
                      >
                        <Rss size={13} /> Feed
                      </Link>
                      <Link
                        href="/perfil"
                        className="flex items-center gap-3 px-4 py-3 font-mono text-xs uppercase tracking-[0.15em] hover:bg-ink hover:text-bone transition-colors border-b border-ink/10"
                      >
                        <User size={13} /> Perfil
                      </Link>
                      {user.isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-3 font-mono text-xs uppercase tracking-[0.15em] hover:bg-ink hover:text-bone transition-colors border-b border-ink/10 text-coral"
                        >
                          <Shield size={13} /> Admin
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 font-mono text-xs uppercase tracking-[0.15em] hover:bg-coral hover:text-bone transition-colors text-left"
                      >
                        <LogOut size={13} /> Sair
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <Link
                    href="/entrar"
                    className="font-mono text-xs uppercase tracking-[0.15em] hover:text-coral transition-colors"
                  >
                    Entrar
                  </Link>
                  <Link href="/entrar" className="btn-brutal">
                    Criar conta
                  </Link>
                </div>
              )}

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

      {/* Mobile slide-out menu */}
      <div className={cn("fixed inset-0 z-50 lg:hidden transition-all duration-500", open ? "visible" : "invisible")}>
        <div
          onClick={() => setOpen(false)}
          className={cn("absolute inset-0 bg-ink/80 backdrop-blur-sm transition-opacity duration-500", open ? "opacity-100" : "opacity-0")}
        />
        <div className={cn(
          "absolute right-0 top-0 bottom-0 w-full sm:max-w-md bg-bone overflow-y-auto transition-transform duration-500 ease-out",
          open ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="flex items-center justify-between px-5 h-16 border-b border-ink/10">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-coral text-ink flex items-center justify-center font-bold text-sm">
                  {initials}
                </span>
                <div>
                  <div className="font-display font-semibold text-sm">{user.name}</div>
                  <div className="font-mono text-[10px] text-ink/50">{user.username}</div>
                </div>
              </div>
            ) : (
              <span className="font-mono text-xs tracking-[0.25em] uppercase">Menu</span>
            )}
            <button
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
              className="w-10 h-10 border border-ink flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="px-5 py-6">
            {publicNavItems.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="group flex items-baseline gap-4 py-4 border-b border-ink/10 hover:pl-2 transition-all"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="font-mono text-[10px] tracking-[0.25em] text-ink/40 w-8">{item.k}</span>
                <span className="font-display text-3xl sm:text-4xl font-semibold tracking-tight group-hover:text-coral transition-colors">
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="px-5 pb-8 mt-4 space-y-3">
            {user ? (
              <>
                <Link
                  href="/perfil"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 border border-ink font-mono text-xs uppercase tracking-[0.15em] font-semibold hover:bg-ink hover:text-bone transition-colors"
                >
                  <User size={14} /> Editar perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 border border-coral/40 font-mono text-xs uppercase tracking-[0.15em] text-coral hover:bg-coral hover:text-bone transition-colors"
                >
                  <LogOut size={14} /> Sair da conta
                </button>
              </>
            ) : (
              <>
                <Link href="/entrar" onClick={() => setOpen(false)} className="btn-brutal w-full justify-center">
                  Criar conta
                </Link>
                <Link
                  href="/entrar"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 border border-ink font-mono text-xs uppercase tracking-[0.15em] font-semibold hover:bg-ink hover:text-bone transition-colors"
                >
                  Já tenho conta · Entrar
                </Link>
              </>
            )}
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/50 mt-4">
              Comunidade desde 2020<br />Maputo · Beira · Online
            </p>
          </div>
        </div>
      </div>

      {/* Mobile "Mais" full-screen drawer */}
      <div className={cn("fixed inset-0 z-50 lg:hidden transition-all duration-300", moreOpen ? "visible" : "invisible")}>
        <div
          onClick={() => setMoreOpen(false)}
          className={cn("absolute inset-0 bg-ink/80 backdrop-blur-sm transition-opacity duration-300", moreOpen ? "opacity-100" : "opacity-0")}
        />
        <div className={cn(
          "absolute inset-0 bg-bone overflow-y-auto transition-transform duration-300 ease-out",
          moreOpen ? "translate-y-0" : "translate-y-full"
        )}>
          <div className="flex items-center justify-between px-5 h-16 border-b border-ink/10 sticky top-0 bg-bone z-10">
            <span className="font-display font-bold text-lg">
              Navegar<span className="text-coral">.</span>
            </span>
            <button
              onClick={() => setMoreOpen(false)}
              aria-label="Fechar"
              className="w-10 h-10 border border-ink flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </div>
          <div className="p-5 grid grid-cols-2 gap-3">
            {allPrivateLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMoreOpen(false)}
                className={cn(
                  "flex flex-col items-center gap-3 p-5 border border-ink/15 hover:border-ink hover:bg-ink hover:text-bone transition-all",
                  pathname === href && "bg-ink text-bone border-ink"
                )}
              >
                <Icon size={22} strokeWidth={1.75} />
                <span className="font-mono text-[10px] uppercase tracking-[0.15em]">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
