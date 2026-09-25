import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { SmartImage } from "@/components/SmartImage";
import { getPublicData } from "@/lib/queries/public";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { settings, posts } = await getPublicData();
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);

  return {
    title: post?.seoTitle || post?.title || settings?.name || "Conteúdo",
    description:
      post?.seoDescription ||
      post?.excerpt ||
      settings?.seoDescription ||
      "Conteúdo da academia.",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { posts } = await getPublicData();
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="page-hero">
      <article className="container prose">
        <span className="eyebrow">CONTEÚDO</span>
        <h1>{post.title}</h1>
        <SmartImage
          src={post.coverUrl}
          alt={post.coverAlt || post.title}
          section="Blog"
          className="media"
        />
        <p className="muted">{post.excerpt}</p>
        <div
          className="rich-content"
          dangerouslySetInnerHTML={{
            __html: post.contentHtml || "",
          }}
        />
      </article>
    </main>
  );
}
