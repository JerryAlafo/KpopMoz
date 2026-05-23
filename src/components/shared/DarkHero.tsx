"use client";

import { useEffect } from "react";
import { useHeaderTheme } from "@/contexts/header-theme";

export function DarkHero() {
  const { setTheme } = useHeaderTheme();
  useEffect(() => {
    setTheme("dark");
    return () => setTheme("light");
  }, [setTheme]);
  return null;
}
