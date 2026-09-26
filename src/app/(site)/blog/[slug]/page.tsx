import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SmartImage } from "@/components/SmartImage";
import { getPostBySlug, getPublishedPosts, getPublicData } from "@/lib/queries/public";
import { sanitizeRichHtml } from "@/lib/sanitize-html";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const { posts } = await getPublishedPosts({ page: 1 });
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { settings } = await getPublicData();
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const title = post?.seoTitle || post?.title || "Conteúdo";
  const description = post?.seoDescription || post?.excerpt || settings?.seoDescription || "Conteúdo da academia.";
  const image = post?.ogImageUrl || post?.coverUrl || undefined;
  return {
    title,
    description,
    alternates: { canonical: "/blog/" + slug },
    openGraph: { title, description, type: "article", url: "/blog/" + slug, images: image ? [image] : undefined },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  return (
    <main className="page-hero">
      <article className="container prose">
        <span className="eyebrow">CONTEÚDO · EQUIPE ACADEMIA DEMO</span>
        <h1>{post.title}</h1>
        <SmartImage src={post.coverUrl} alt={post.coverAlt || post.title} section="Blog" className="media" />
        <p className="muted">{post.excerpt}</p>
        <div className="rich-content" dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(post.contentHtml || "") }} />
      </article>
    </main>
  );
}
