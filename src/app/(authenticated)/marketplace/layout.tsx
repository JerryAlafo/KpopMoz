"use client";
import { AuthGate } from "@/components/shared/AuthGate";
export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
