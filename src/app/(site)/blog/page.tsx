import type { Metadata } from "next";
import Link from "next/link";

import { SmartImage } from "@/components/SmartImage";
import { getPublishedPosts, getPublicData, publicMetadata } from "@/lib/queries/public";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getPublicData();
  return publicMetadata(settings, "Conteúdo", "Conteúdos para treinar melhor dentro e fora da academia.", "/blog");
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page || "1") || 1);
  const { posts, hasNext } = await getPublishedPosts({ page });
  return (
    <main className="page-hero">
      <div className="container">
        <span className="eyebrow">CONTEÚDO</span>
        <h1>CONTEÚDO</h1>
        <div className="grid grid-3 page-grid">
          {posts.map((item) => (
            <Link className="card" href={"/blog/" + item.slug} key={item.id}>
              <SmartImage src={item.coverUrl} alt={item.coverAlt || item.title} section="Blog" className="media" />
              <h2>{item.title}</h2>
              <p className="muted">{item.excerpt}</p>
            </Link>
          ))}
        </div>
        <nav className="pagination" aria-label="Paginação">
          {page > 1 ? <Link href={"/blog?page=" + (page - 1)}>← Anteriores</Link> : <span />}
          <strong>Página {page}</strong>
          {hasNext ? <Link href={"/blog?page=" + (page + 1)}>Próximos →</Link> : <span />}
        </nav>
      </div>
    </main>
  );
}
