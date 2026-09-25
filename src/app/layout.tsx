import "./globals.css";
import type { Metadata, Viewport } from "next";
import { fontDisplay, fontSans } from "@/core/theme/fonts";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: "Academia Demo VireMarca",
  description: "Performance, força e movimento.",
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Academia Demo VireMarca",
    description: "Performance, força e movimento.",
    type: "website",
    locale: "pt_BR",
  },
};
export const viewport: Viewport = { themeColor: "#0A0A0B" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fontSans.variable} ${fontDisplay.variable}`}>
      <body>{children}</body>
    </html>
  );
}
