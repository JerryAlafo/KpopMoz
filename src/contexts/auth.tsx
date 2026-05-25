"use client";

import { createContext, useContext } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export interface KMUser {
  name: string;
  username: string;
  email: string;
  city: string;
  bio: string;
  fandoms: string[];
  isAdmin?: boolean;
  isBanned?: boolean;
  onboardingComplete?: boolean;
  image?: string | null;
}

interface AuthCtx {
  user: KMUser | null;
  loading: boolean;
  authenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  loading: true,
  authenticated: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const user: KMUser | null = session?.user
    ? {
        name:               session.user.name               ?? "",
        username:           session.user.username           ?? "",
        email:              session.user.email              ?? "",
        city:               session.user.city               ?? "Maputo",
        bio:                session.user.bio                ?? "",
        fandoms:            session.user.fandoms            ?? [],
        isAdmin:            session.user.isAdmin            ?? false,
        isBanned:           session.user.isBanned           ?? false,
        onboardingComplete: session.user.onboardingComplete ?? true,
        image:              session.user.image,
      }
    : null;

  function login() {
    signIn("google", { callbackUrl: "/conta/feed" });
  }

  function logout() {
    signOut({ callbackUrl: "/" });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: status === "loading",
        authenticated: status === "authenticated",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
