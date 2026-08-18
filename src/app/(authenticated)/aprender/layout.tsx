"use client";
import { AuthGate } from "@/components/shared/AuthGate";
export default function AprenderLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
