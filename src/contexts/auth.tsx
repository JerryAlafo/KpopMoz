"use client";

import { createContext, useContext, useState, useEffect } from "react";

export interface KMUser {
  name: string;
  username: string;
  email: string;
  city: string;
  bio: string;
  fandoms: string[];
  joinedAt: string;
}

const DEMO_USER: KMUser = {
  name: "Leila Muteia",
  username: "@leila.muteia",
  email: "leila@email.mz",
  city: "Maputo",
  bio: "ARMY desde 2017 · Cover dancer · Membro KM desde 2021",
  fandoms: ["ARMY", "BLINK", "ONCE"],
  joinedAt: "2021-03-15",
};

interface AuthCtx {
  user: KMUser | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<KMUser | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("km_session");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

  function login(email: string) {
    const u = { ...DEMO_USER, email };
    setUser(u);
    localStorage.setItem("km_session", JSON.stringify(u));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("km_session");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
