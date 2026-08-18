"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Eye, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import {
  clearGuestMode,
  enableGuestMode,
  GUEST_MODE_CHANGED_EVENT,
  isGuestBlockedPath,
  isGuestModeActive,
  isGuestPublicPath,
  LOGIN_REQUIRED_EVENT,
  type LoginRequiredDetail,
} from "@/lib/guest-mode";

interface GuestModeContextValue {
  isGuest: boolean;
  requestLogin: (detail?: LoginRequiredDetail) => void;
}

const GuestModeContext = createContext<GuestModeContextValue>({
  isGuest: false,
  requestLogin: () => {},
});

function currentReturnTo(pathname: string) {
  if (typeof window === "undefined") return pathname;
  return `${pathname}${window.location.search}${window.location.hash}`;
}

function subscribeGuestMode(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(GUEST_MODE_CHANGED_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(GUEST_MODE_CHANGED_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useGuestMode() {
  return useContext(GuestModeContext);
}

export default function GuestModeProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { authenticated, loading } = useAuth();
  const [modal, setModal] = useState<LoginRequiredDetail | null>(null);

  const guestModeActive = useSyncExternalStore(
    subscribeGuestMode,
    isGuestModeActive,
    () => false
  );

  const isGuest = authenticated === false && guestModeActive;
  const shouldPromptGuestMode =
    !loading &&
    authenticated === false &&
    !guestModeActive &&
    isGuestPublicPath(pathname);

  const guestPromptTitle = pathname.startsWith("/post/")
    ? "Ver publicacao como convidado?"
    : "Continuar como convidado?";
  const guestPromptMessage = pathname.startsWith("/post/")
    ? "Podes ver esta publicacao normalmente em modo convidado. Para gostar, comentar ou seguir alguem, vamos pedir login."
    : "Podes explorar esta area em modo convidado. Acoes como gostar, comentar e seguir continuam a pedir login.";

  useEffect(() => {
    if (authenticated && guestModeActive) {
      clearGuestMode();
    }
  }, [authenticated, guestModeActive]);

  const requestLogin = useCallback((detail: LoginRequiredDetail = {}) => {
    setModal({
      title: detail.title || "Login obrigatorio",
      message:
        detail.message ||
        "Para fazer esta acao, entra na tua conta ou cria uma conta no KPOP.MZ.",
      returnTo: detail.returnTo || currentReturnTo(pathname),
    });
  }, [pathname]);

  useEffect(() => {
    const handleLoginRequired = (event: Event) => {
      requestLogin((event as CustomEvent<LoginRequiredDetail>).detail || {});
    };

    window.addEventListener(LOGIN_REQUIRED_EVENT, handleLoginRequired);
    return () => window.removeEventListener(LOGIN_REQUIRED_EVENT, handleLoginRequired);
  }, [requestLogin]);

  useEffect(() => {
    if (!isGuest) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get("loginRequired") === "1") {
      window.setTimeout(() => {
        requestLogin({
          returnTo: params.get("next") || undefined,
        });
      }, 0);
    }
  }, [isGuest, pathname, requestLogin]);

  useEffect(() => {
    if (!isGuest || !isGuestBlockedPath(pathname)) return;

    const next = encodeURIComponent(currentReturnTo(pathname));
    router.replace(`/feed?loginRequired=1&next=${next}`);
  }, [isGuest, pathname, router]);

  const goToLogin = useCallback((returnTo?: string) => {
    clearGuestMode();
    setModal(null);
    const callbackUrl = encodeURIComponent(returnTo || currentReturnTo(pathname));
    router.push(`/entrar?callbackUrl=${callbackUrl}`);
  }, [pathname, router]);

  const continueAsGuest = useCallback(() => {
    setModal(null);
    enableGuestMode();
  }, []);

  const value = useMemo(() => ({
    isGuest,
    requestLogin,
  }), [isGuest, requestLogin]);

  return (
    <GuestModeContext.Provider value={value}>
      {children}

      {isGuest && (
        <div
          className="fixed right-5 bottom-5 z-[900] flex items-center gap-3 max-w-[min(420px,calc(100vw-32px))] px-3.5 py-3 bg-bone border border-ink/15 shadow-[0_16px_40px_rgba(0,0,0,0.34)]"
          role="status"
          aria-label="Modo convidado ativo"
        >
          <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-coral/10 text-coral border border-coral/20">
            <Eye size={18} />
          </div>
          <div className="min-w-0 flex flex-col gap-px">
            <span className="font-display font-bold text-[13px] leading-tight">Modo convidado</span>
            <span className="font-mono text-[10px] text-ink/50">Algumas acoes precisam de login.</span>
          </div>
          <button
            type="button"
            onClick={() => goToLogin()}
            className="shrink-0 inline-flex items-center gap-1.5 min-h-8 px-3 bg-ink text-bone font-mono text-[10px] uppercase tracking-[0.15em] hover:bg-coral transition-colors"
          >
            <LogIn size={14} />
            Entrar
          </button>
        </div>
      )}

      {modal && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="guest-login-title"
        >
          <div className="w-full max-w-sm p-6 bg-bone border border-ink/20 shadow-[0_22px_60px_rgba(0,0,0,0.38)] text-center">
            <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4 bg-coral/10 text-coral border border-coral/20">
              <LogIn size={24} />
            </div>
            <h2 id="guest-login-title" className="font-display font-bold text-lg mb-2">{modal.title}</h2>
            <p className="font-mono text-xs text-ink/60 leading-relaxed mb-5">{modal.message}</p>
            <button
              type="button"
              onClick={() => goToLogin(modal.returnTo)}
              className="w-full min-h-[42px] inline-flex items-center justify-center gap-2 bg-ink text-bone font-mono text-xs uppercase tracking-[0.2em] hover:bg-coral transition-colors"
            >
              OK, entrar ou criar conta
            </button>
          </div>
        </div>
      )}

      {!modal && shouldPromptGuestMode && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="guest-view-title"
        >
          <div className="w-full max-w-sm p-6 bg-bone border border-ink/20 shadow-[0_22px_60px_rgba(0,0,0,0.38)] text-center">
            <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4 bg-coral/10 text-coral border border-coral/20">
              <Eye size={24} />
            </div>
            <h2 id="guest-view-title" className="font-display font-bold text-lg mb-2">{guestPromptTitle}</h2>
            <p className="font-mono text-xs text-ink/60 leading-relaxed mb-5">{guestPromptMessage}</p>
            <button
              type="button"
              onClick={continueAsGuest}
              className="w-full min-h-[42px] inline-flex items-center justify-center gap-2 bg-ink text-bone font-mono text-xs uppercase tracking-[0.2em] hover:bg-coral transition-colors"
            >
              Ver como convidado
            </button>
          </div>
        </div>
      )}
    </GuestModeContext.Provider>
  );
}
