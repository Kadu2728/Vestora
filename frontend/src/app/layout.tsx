import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Vestora — Acompanhe sua carteira de investimentos em tempo real",
  description:
    "Vestora consolida ações, FIIs, renda fixa e cripto em um só painel. Acompanhe patrimônio, dividendos e rentabilidade em tempo real.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
