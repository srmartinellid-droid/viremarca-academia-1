import type { Metadata } from "next";

import { SmartImage } from "@/components/SmartImage";
import { getPublicData, publicMetadata } from "@/lib/queries/public";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getPublicData();

  return publicMetadata(settings, "Equipe", "Conheça a equipe que acompanha seus treinos.");
}

export default async function Page() {
  const { instructors } = await getPublicData();

  return (
    <main className="page-hero">
      <div className="container">
        <span className="eyebrow">TIME</span>
        <h1>EQUIPE</h1>
        <div className="grid grid-4 page-grid">
          {instructors.map((item) => (
            <article className="card" key={item.id}>
              <SmartImage
                src={item.photoUrl}
                alt={item.photoAlt || item.name}
                section={item.name}
                className="media tall"
              />
              <h2>{item.name}</h2>
              <p className="eyebrow">{item.role}</p>
              <p className="muted">{item.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
