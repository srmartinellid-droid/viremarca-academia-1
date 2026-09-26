import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { fontDisplay, fontSans } from "@/core/theme/fonts";
import "./globals.css";

const SITE_URL = process.env.SITE_URL || "https://viremarca-academia-1.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Academia Demo VireMarca", template: "%s | Academia Demo" },
  description: "Template demonstrativo de academia criado pela VireMarca.",
  applicationName: "Academia Demo VireMarca",
  manifest: "/manifest.webmanifest",
  openGraph: { type: "website", locale: "pt_BR", siteName: "Academia Demo VireMarca" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#0A0A0B" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={fontSans.variable + " " + fontDisplay.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
