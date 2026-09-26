import type { Metadata } from "next";

import { notFound } from "next/navigation";
import Link from "next/link";

import { SmartImage } from "@/components/SmartImage";
import { getPublicData } from "@/lib/queries/public";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { settings, modalities } = await getPublicData();
  const { slug } = await params;
  const modality = modalities.find((item) => item.slug === slug);

  return {
    title: modality?.seoTitle || modality?.name || settings?.name || "Modalidade",
    description:
      modality?.seoDescription ||
      modality?.summary ||
      settings?.seoDescription ||
      "Conheça esta modalidade.",
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { modalities } = await getPublicData();
  const modality = modalities.find((item) => item.slug === slug);

  if (!modality) {
    notFound();
  }

  return (
    <main className="page-hero">
      <div className="container prose">
        <span className="eyebrow">MODALIDADE</span>
        <h1>{modality.name}</h1>
        <SmartImage
          src={modality.imageUrl}
          alt={modality.imageAlt || modality.name}
          section={modality.name}
          className="media"
        />
        <p>{modality.description || modality.summary}</p>
        <p className="muted">
          {modality.durationMin ? `${modality.durationMin} minutos · ` : ""}
          Nível {modality.level}
        </p>
        <Link className="btn" href="/#trial">
          EXPERIMENTAR
        </Link>
      </div>
    </main>
  );
}
