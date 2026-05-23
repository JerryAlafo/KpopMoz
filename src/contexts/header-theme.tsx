"use client";

import { createContext, useContext, useState } from "react";

type HeroTheme = "light" | "dark";

const HeaderThemeCtx = createContext<{
  theme: HeroTheme;
  setTheme: (t: HeroTheme) => void;
}>({ theme: "light", setTheme: () => {} });

export function HeaderThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<HeroTheme>("light");
  return (
    <HeaderThemeCtx.Provider value={{ theme, setTheme }}>
      {children}
    </HeaderThemeCtx.Provider>
  );
}

export const useHeaderTheme = () => useContext(HeaderThemeCtx);
