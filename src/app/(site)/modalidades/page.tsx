import type { Metadata } from "next";
import Link from "next/link";

import { SmartImage } from "@/components/SmartImage";
import { getPublicData, publicMetadata } from "@/lib/queries/public";
import { sanitizeRichHtml } from "@/lib/sanitize-html";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getPublicData();
  return publicMetadata(settings, "Modalidades", "Conheça as modalidades e encontre o treino certo para seu objetivo.", "/modalidades");
}

export default async function Page() {
  const { modalities } = await getPublicData();
  return (
    <main className="page-hero">
      <div className="container">
        <span className="eyebrow">TREINO</span><h1>MODALIDADES</h1>
        <p className="muted">Escolha o estímulo que combina com seu objetivo.</p>
        <div className="grid grid-3 page-grid">
          {modalities.map((item) => (
            <Link className="card" href={"/modalidades/" + item.slug} key={item.id}>
              <SmartImage src={item.imageUrl} alt={item.imageAlt || item.name} section={item.name} className="media" />
              <h2>{item.name}</h2>
              <div className="rich-content" dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(item.description || item.summary || "") }} />
              <small>{item.durationMin ? item.durationMin + " min · " : ""}{item.level}</small>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
