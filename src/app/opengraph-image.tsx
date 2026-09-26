import { ImageResponse } from "next/og";

export const alt = "Academia Demo VireMarca";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Padrão VireMarca 17: logo inteiro no quadrado central de 630 px, fundo liso, sem texto miúdo. */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0A0A0B",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <svg width="220" height="220" viewBox="0 0 64 64">
          <rect width="64" height="64" rx="14" fill="#141416" />
          <path d="M10 48 30 10h10l14 38H43l-5-12H25l-6 12H10Zm20-28-4 9h8l-4-9Z" fill="#C6FF00" />
        </svg>
        <div
          style={{
            display: "flex",
            color: "#F5F5F4",
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: 4,
          }}
        >
          ACADEMIA DEMO
        </div>
      </div>
    </div>,
    size,
  );
}
