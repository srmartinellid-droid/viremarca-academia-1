import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { getPublicData } from "@/lib/queries/public";
import { fontDisplay, fontSans } from "@/core/theme/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://viremarca-academia-1.vercel.app"),
  title: { default: "Academia Demo VireMarca", template: "%s | Academia Demo" },
  description: "Template demonstrativo de academia criado pela VireMarca.",
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icon.svg" },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { settings } = await getPublicData();
  const name = settings?.name || "Academia Demo";

  return (
    <html lang="pt-BR" className={fontSans.variable + " " + fontDisplay.variable}>
      <body>
        <div className="demo-banner">
          <span>DEMO · Este site é uma demonstração de produto VireMarca.</span>
          <Link href="https://www.viremarca.com.br" target="_blank" rel="noopener noreferrer">Conhecer a VireMarca</Link>
        </div>
        <Header name={name} whatsapp={settings?.whatsapp} whatsappMessage={settings?.whatsappMessage} />
        {children}
        <Footer name={name} phone={settings?.phone} email={settings?.email} />
        <WhatsAppFloat phone={settings?.whatsapp} message={settings?.whatsappMessage} />
        <Analytics />
      </body>
    </html>
  );
}
