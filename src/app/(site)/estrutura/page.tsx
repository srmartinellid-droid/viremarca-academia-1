import type { Metadata } from "next";

import { SmartImage } from "@/components/SmartImage";
import { getPublicData, publicMetadata } from "@/lib/queries/public";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getPublicData();

  return publicMetadata(settings, "Estrutura", "Conheça os espaços e a estrutura da academia.");
}

export default async function Page() {
  const { gallery } = await getPublicData();

  return (
    <main className="page-hero">
      <div className="container">
        <span className="eyebrow">AMBIENTE</span>
        <h1>ESTRUTURA</h1>
        <div className="grid grid-3 page-grid">
          {gallery.map((item) => (
            <article key={item.id}>
              <SmartImage
                src={item.imageUrl}
                alt={item.imageAlt}
                section={item.area}
                className="media"
              />
              <h2>{item.area}</h2>
              <p className="muted">{item.caption}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
