import localFont from "next/font/local";

/**
 * Fontes auto-hospedadas a partir de pacotes npm (@fontsource). O build não depende do
 * Google Fonts, e nenhuma requisição externa de fonte acontece no navegador.
 */
export const fontSans = localFont({
  src: "../../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-sans",
  display: "swap",
  weight: "100 900",
});

export const fontDisplay = localFont({
  src: "../../../node_modules/@fontsource/anton/files/anton-latin-400-normal.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "400",
});
