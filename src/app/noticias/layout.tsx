"use client";
import { AuthGate } from "@/components/shared/AuthGate";
export default function NoticiasLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
