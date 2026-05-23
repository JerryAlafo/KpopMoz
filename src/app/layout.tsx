import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "KPOP.MZ — Comunidade K-POP de Moçambique",
  description:
    "O ecossistema digital da comunidade K-POP em Moçambique. Notícias, eventos, talentos locais, marketplace e cultura coreana, desde 2020.",
  keywords: [
    "K-POP",
    "Moçambique",
    "Maputo",
    "BTS",
    "BLACKPINK",
    "Stray Kids",
    "Cover Dance",
    "KpopMoçambique",
    "KM",
  ],
  openGraph: {
    title: "KPOP.MZ — Comunidade K-POP de Moçambique",
    description: "O coração do K-POP bate em Moçambique. Desde 2020.",
    locale: "pt_MZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-MZ">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bone text-ink antialiased font-body">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
