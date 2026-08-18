import type { Metadata } from "next";
import SuporteClient from "@/components/suporte/SuporteClient";

export const metadata: Metadata = {
  title: "Suporte / Criador",
  description:
    "Contacta Jerry de Jesus, criador da KPOP.MZ. Encontra os links oficiais de WhatsApp, Instagram e TikTok. Sugestões, bug reports e feedback bem-vindos.",
};

export default function SuportePage() {
  return <SuporteClient />;
}
