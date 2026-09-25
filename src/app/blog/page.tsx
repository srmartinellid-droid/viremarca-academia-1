import type { Metadata } from "next";

import Link from "next/link";

import { SmartImage } from "@/components/SmartImage";
import { getPublicData, publicMetadata } from "@/lib/queries/public";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getPublicData();

  return publicMetadata(
    settings,
    "Conteúdo",
    "Conteúdos para treinar melhor dentro e fora da academia.",
  );
}

export default async function Page() {
  const { posts } = await getPublicData();

  return (
    <main className="page-hero">
      <div className="container">
        <span className="eyebrow">CONTEÚDO</span>
        <h1>CONTEÚDO</h1>
        <div className="grid grid-3 page-grid">
          {posts.map((item) => (
            <Link
              className="card"
              href={`/blog/${item.slug}`}
              key={item.id}
            >
              <SmartImage
                src={item.coverUrl}
                alt={item.coverAlt || item.title}
                section="Blog"
                className="media"
              />
              <h2>{item.title}</h2>
              <p className="muted">{item.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
