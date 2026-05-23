"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, User, Calendar, Heart, Rss, ShieldCheck, LogOut, ChevronRight, Shield } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Feed",       href: "/conta/feed",      icon: Rss },
  { label: "Eventos",    href: "/conta/eventos",   icon: Calendar },
  { label: "Dashboard",  href: "/conta",           icon: LayoutDashboard },
  { label: "Favoritos",  href: "/conta/favoritos", icon: Heart },
  { label: "Perfil",     href: "/conta/perfil",    icon: User },
];

export default function ContaLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user === null) {
      const timer = setTimeout(() => {
        if (!localStorage.getItem("km_session")) {
          router.replace("/entrar");
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [user, router]);

  if (!user) return null;

  const initials = user.name.split(" ").map((n) => n[0]).slice(0, 2).join("");

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-bone pt-16 lg:pt-20">

      {/* ── Main grid ────────────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-12 pb-24 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 lg:gap-10">

          {/* Desktop sidebar */}
          <aside className="hidden lg:flex flex-col gap-3 self-start sticky top-24">
            <div className="bg-ink text-bone p-5 grain">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-coral flex items-center justify-center font-display font-black text-lg text-ink">
                  {initials}
                </div>
                <div>
                  <div className="font-display font-bold text-lg leading-tight">{user.name}</div>
                  <div className="font-mono text-[10px] tracking-[0.2em] text-bone/50">{user.username}</div>
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
                href="/conta/admin"
                className={cn(
                  "flex items-center justify-between px-4 py-3 font-mono text-xs uppercase tracking-[0.15em] transition-colors group border border-coral/30",
                  pathname === "/conta/admin" ? "bg-coral text-bone" : "text-coral hover:bg-coral/5"
                )}
              >
                <span className="flex items-center gap-3">
                  <ShieldCheck size={14} strokeWidth={1.75} />
                  Admin
                </span>
                <ChevronRight size={12} className={cn("transition-opacity", pathname === "/conta/admin" ? "opacity-100" : "opacity-0 group-hover:opacity-40")} />
              </Link>
            )}

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
        {navLinks.map(({ label, href, icon: Icon }) => {
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
              <Icon
                size={20}
                strokeWidth={active ? 2.25 : 1.75}
                className={active ? "text-coral" : ""}
              />
              <span className="font-mono text-[8px] uppercase tracking-[0.1em]">
                {label}
              </span>
            </Link>
          );
        })}
        {user.isAdmin && (
          <Link
            href="/conta/admin"
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors",
              pathname === "/conta/admin" ? "text-coral" : "text-ink/40 hover:text-ink"
            )}
          >
            <Shield
              size={20}
              strokeWidth={pathname === "/conta/admin" ? 2.25 : 1.75}
              className={pathname === "/conta/admin" ? "text-coral" : ""}
            />
            <span className="font-mono text-[8px] uppercase tracking-[0.1em]">Admin</span>
          </Link>
        )}
      </nav>

    </div>
  );
}
