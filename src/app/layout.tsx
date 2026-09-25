import "./globals.css";

import type { Metadata, Viewport } from "next";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { fontDisplay, fontSans } from "@/core/theme/fonts";
import { getPublicData } from "@/lib/queries/public";

export const revalidate = 300;

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
};

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getPublicData();

  return {
    metadataBase: new URL(
      process.env.SITE_URL || "http://localhost:3000",
    ),
    title: settings?.seoTitle || settings?.name || "Academia",
    description:
      settings?.seoDescription || "Performance, força e movimento.",
    manifest: "/manifest.webmanifest",
    openGraph: {
      title: settings?.seoTitle || settings?.name || "Academia",
      description:
        settings?.seoDescription || "Performance, força e movimento.",
      type: "website",
      locale: "pt_BR",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { settings } = await getPublicData();
  const name = settings?.name || "Academia";

  return (
    <html
      lang="pt-BR"
      className={`${fontSans.variable} ${fontDisplay.variable}`}
    >
      <body>
        <Header
          name={name}
          whatsapp={settings?.whatsapp}
          whatsappMessage={settings?.whatsappMessage}
        />
        {children}
        <WhatsAppFloat
          whatsapp={settings?.whatsapp}
          whatsappMessage={settings?.whatsappMessage}
        />
        <Footer
          name={name}
          phone={settings?.phone}
          email={settings?.email}
        />
      </body>
    </html>
  );
}
