import type { MetadataRoute } from "next";

import { getPublicData } from "@/lib/queries/public";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { modalities, posts } = await getPublicData();
  const baseUrl = process.env.SITE_URL || "http://localhost:3000";

  const routes = [
    "",
    "/modalidades",
    "/horarios",
    "/planos",
    "/equipe",
    "/estrutura",
    "/blog",
    "/contato",
    "/aula-experimental",
  ];

  return [
    ...routes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
    })),
    ...modalities.map((item) => ({
      url: `${baseUrl}/modalidades/${item.slug}`,
      lastModified: item.updatedAt,
    })),
    ...posts.map((item) => ({
      url: `${baseUrl}/blog/${item.slug}`,
      lastModified: item.updatedAt,
    })),
  ];
}
