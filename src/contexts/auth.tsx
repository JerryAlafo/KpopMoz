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
  onboardingComplete?: boolean;
  image?: string | null;
}

interface AuthCtx {
  user: KMUser | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  const user: KMUser | null = session?.user
    ? {
        name:               session.user.name               ?? "",
        username:           session.user.username           ?? "",
        email:              session.user.email              ?? "",
        city:               session.user.city               ?? "Maputo",
        bio:                session.user.bio                ?? "",
        fandoms:            session.user.fandoms            ?? [],
        isAdmin:            session.user.isAdmin            ?? false,
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
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
