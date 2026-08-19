"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, User, Calendar, Heart, Rss, ShieldCheck, LogOut, ChevronRight, Shield, HeartHandshake, Grid3X3, Newspaper, Mic2, Music, ShoppingBag, BookOpen, Search, X } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { useGuestMode } from "@/components/layout/GuestModeProvider";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Feed",        href: "/feed",        icon: Rss },
  { label: "Notícias",    href: "/noticias",    icon: Newspaper },
  { label: "Eventos",     href: "/eventos",     icon: Calendar },
  { label: "Artistas",    href: "/artistas",    icon: Mic2 },
  { label: "Talentos",    href: "/talentos",    icon: Music },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { label: "Aprender",    href: "/aprender",    icon: BookOpen },
  { label: "Dashboard",   href: "/dashboard",   icon: LayoutDashboard },
  { label: "Favoritos",   href: "/favoritos",   icon: Heart },
  { label: "Perfil",      href: "/perfil",      icon: User },
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

export default function ContaLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, authenticated, logout } = useAuth();
  const { isGuest } = useGuestMode();
  const router = useRouter();
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!authenticated && !isGuest) {
      router.replace("/entrar");
      return;
    }
    if (isGuest && pathname !== "/feed") {
      const next = encodeURIComponent(`${pathname}${window.location.search}${window.location.hash}`);
      router.replace(`/feed?loginRequired=1&next=${next}`);
      return;
    }
    if (user && user.onboardingComplete === false) {
      router.replace("/onboarding");
    }
    if (user && user.isBanned) {
      router.replace("/banido");
    }
  }, [authenticated, loading, user, router, isGuest, pathname]);

  if (loading) return null;

  // Modo convidado: só o feed, sem sidebar privada
  if (isGuest) {
    return (
      <div className="min-h-screen bg-bone">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-12 pb-24 lg:pb-12">
          {children}
        </div>
      </div>
    );
  }

  if (!user) return null;

  const initials = user.name.split(" ").map((n) => n[0]).slice(0, 2).join("");

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-bone">

      {/* ── Main grid ────────────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-12 pb-24 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 lg:gap-10">

          {/* Desktop sidebar */}
          <aside className="hidden lg:flex flex-col gap-3 self-start sticky top-8">
            <div className="bg-ink text-bone p-5 grain">
              <div className="flex items-center gap-3 mb-4">
                {/* Avatar: foto real ou iniciais */}
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-12 h-12 object-cover shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 bg-coral flex items-center justify-center font-display font-black text-lg text-ink shrink-0">
                    {initials}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-display font-bold text-lg leading-tight truncate">{user.name}</div>
                  <div className="font-mono text-[10px] tracking-[0.2em] text-bone/50 truncate">{user.username}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {user.fandoms.map((f) => (
                  <span key={f} className="font-mono text-[9px] tracking-[0.15em] uppercase bg-bone/10 px-2 py-0.5 text-bone/70">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <nav className="space-y-1">
              {navLinks.map(({ label, href, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 font-mono text-xs uppercase tracking-[0.15em] transition-colors group",
                      active ? "bg-ink text-bone" : "hover:bg-ink/5 text-ink/70 hover:text-ink"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={14} strokeWidth={1.75} />
                      {label}
                    </span>
                    <ChevronRight size={12} className={cn(
                      "transition-opacity",
                      active ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                    )} />
                  </Link>
                );
              })}
            </nav>

            {user.isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  "flex items-center justify-between px-4 py-3 font-mono text-xs uppercase tracking-[0.15em] transition-colors group border border-coral/30",
                  pathname === "/admin" ? "bg-coral text-bone" : "text-coral hover:bg-coral/5"
                )}
              >
                <span className="flex items-center gap-3">
                  <ShieldCheck size={14} strokeWidth={1.75} />
                  Admin
                </span>
                <ChevronRight size={12} className={cn("transition-opacity", pathname === "/admin" ? "opacity-100" : "opacity-0 group-hover:opacity-40")} />
              </Link>
            )}

            <Link
              href="/suporte"
              className={cn(
                "flex items-center justify-between px-4 py-3 font-mono text-xs uppercase tracking-[0.15em] transition-colors group",
                pathname === "/suporte" ? "bg-ink text-bone" : "text-ink/50 hover:text-ink hover:bg-ink/5"
              )}
            >
              <span className="flex items-center gap-3">
                <HeartHandshake size={14} strokeWidth={1.75} />
                Suporte
              </span>
              <ChevronRight size={12} className={cn(
                "transition-opacity",
                pathname === "/suporte" ? "opacity-100" : "opacity-0 group-hover:opacity-40"
              )} />
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 font-mono text-xs uppercase tracking-[0.15em] text-ink/50 hover:text-coral hover:bg-coral/5 transition-colors"
            >
              <LogOut size={14} strokeWidth={1.75} />
              Sair da conta
            </button>
          </aside>

          {/* Main content */}
          <main className="min-w-0">{children}</main>
        </div>
      </div>

      {/* ── Mobile bottom nav ────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-bone border-t border-ink/10 flex">
        {[
          { label: "Feed", href: "/feed", icon: Rss },
          { label: "Eventos", href: "/eventos", icon: Calendar },
        ].map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors",
                active ? "text-coral" : "text-ink/40 hover:text-ink"
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.25 : 1.75} className={active ? "text-coral" : ""} />
              <span className="font-mono text-[8px] uppercase tracking-[0.1em]">{label}</span>
            </Link>
          );
        })}
        {user.isAdmin ? (
          <Link
            href="/admin"
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors",
              pathname === "/admin" ? "text-coral" : "text-ink/40 hover:text-ink"
            )}
          >
            <Shield size={20} strokeWidth={pathname === "/admin" ? 2.25 : 1.75} className={pathname === "/admin" ? "text-coral" : ""} />
            <span className="font-mono text-[8px] uppercase tracking-[0.1em]">Admin</span>
          </Link>
        ) : (
          <Link
            href="/perfil"
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors",
              pathname === "/perfil" ? "text-coral" : "text-ink/40 hover:text-ink"
            )}
          >
            <User size={20} strokeWidth={pathname === "/perfil" ? 2.25 : 1.75} className={pathname === "/perfil" ? "text-coral" : ""} />
            <span className="font-mono text-[8px] uppercase tracking-[0.1em]">Perfil</span>
          </Link>
        )}
        <button
          onClick={() => setMoreOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-ink/40 hover:text-ink transition-colors"
        >
          <Grid3X3 size={20} strokeWidth={1.75} />
          <span className="font-mono text-[8px] uppercase tracking-[0.1em]">Mais</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-ink/40 hover:text-coral transition-colors"
        >
          <LogOut size={20} strokeWidth={1.75} />
          <span className="font-mono text-[8px] uppercase tracking-[0.1em]">Sair</span>
        </button>
      </nav>

      {/* ── Mobile "Mais" full-screen drawer ────────────── */}
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

    </div>
  );
}
