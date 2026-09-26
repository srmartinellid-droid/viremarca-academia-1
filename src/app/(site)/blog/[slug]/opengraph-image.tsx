import { ImageResponse } from "next/og";

import { getPostBySlug } from "@/lib/queries/public";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 70, background: "#0A0A0B", color: "#F5F5F4" }}>
      <div style={{ fontSize: 24, color: "#C6FF00", fontWeight: 800 }}>ACADEMIA DEMO VIREMARCA</div>
      <div style={{ marginTop: 24, fontSize: 60, fontWeight: 900 }}>{post?.title || "Conteúdo"}</div>
      <div style={{ marginTop: 20, fontSize: 24, color: "#A1A1AA" }}>{post?.excerpt || "Conteúdo demonstrativo."}</div>
    </div>,
    size,
  );
}
