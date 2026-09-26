import "server-only";

import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { and, asc, desc, eq, lte } from "drizzle-orm";

import { db } from "@/db";
import {
  classSchedule,
  faqs,
  galleryItems,
  heroSlides,
  homeSections,
  instructors,
  modalities,
  openingExceptions,
  plans,
  posts,
  siteSettings,
  stats,
  testimonials,
} from "@/db/schema";

const PUBLIC_TAGS = [
  "settings", "hero", "modalities", "schedule", "plans",
  "posts", "gallery", "team", "faq", "testimonials",
];

const getCachedPublicHome = unstable_cache(
  async () => {
    const now = new Date();
    const [
      settings, sections, hero, statRows, modalityRows, instructorRows,
      scheduleRows, planRows, galleryRows, postRows, testimonialRows, faqRows, exceptionRows,
    ] = await Promise.all([
      db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1),
      db.select().from(homeSections).where(eq(homeSections.active, true)).orderBy(asc(homeSections.sortOrder)),
      db.select().from(heroSlides).where(eq(heroSlides.active, true)).orderBy(asc(heroSlides.sortOrder)),
      db.select().from(stats).where(eq(stats.active, true)).orderBy(asc(stats.sortOrder)),
      db.select().from(modalities).where(eq(modalities.active, true)).orderBy(asc(modalities.sortOrder)),
      db.select().from(instructors).where(eq(instructors.active, true)).orderBy(asc(instructors.sortOrder)),
      db.select().from(classSchedule).where(eq(classSchedule.active, true)).orderBy(asc(classSchedule.weekday), asc(classSchedule.startsAt)),
      db.select().from(plans).where(eq(plans.active, true)).orderBy(asc(plans.sortOrder)),
      db.select().from(galleryItems).where(eq(galleryItems.active, true)).orderBy(asc(galleryItems.sortOrder)),
      db.select().from(posts).where(and(eq(posts.status, "published"), lte(posts.publishedAt, now))).orderBy(desc(posts.publishedAt)).limit(3),
      db.select().from(testimonials).where(eq(testimonials.active, true)).orderBy(asc(testimonials.sortOrder)),
      db.select().from(faqs).where(eq(faqs.active, true)).orderBy(asc(faqs.sortOrder)),
      db.select().from(openingExceptions).orderBy(asc(openingExceptions.date)),
    ]);
    return {
      settings: settings[0] ?? null, sections, hero, stats: statRows, modalities: modalityRows,
      instructors: instructorRows, schedule: scheduleRows, plans: planRows, gallery: galleryRows,
      posts: postRows, testimonials: testimonialRows, faqs: faqRows, openingExceptions: exceptionRows,
    };
  },
  ["public-home"],
  { revalidate: 300, tags: PUBLIC_TAGS },
);

const getPublishedPostsCached = unstable_cache(
  async (page: number) => {
    const now = new Date();
    const rows = await db.select().from(posts)
      .where(and(eq(posts.status, "published"), lte(posts.publishedAt, now)))
      .orderBy(desc(posts.publishedAt))
      .limit(10)
      .offset((page - 1) * 9);
    return { posts: rows.slice(0, 9), hasNext: rows.length > 9, page };
  },
  ["published-posts"],
  { revalidate: 300, tags: ["posts"] },
);

export async function getPublishedPosts({ page = 1 }: { page?: number } = {}) {
  return getPublishedPostsCached(Math.max(1, page));
}

const getPostBySlugCached = unstable_cache(
  async (slug: string) => {
    const now = new Date();
    const rows = await db.select().from(posts)
      .where(and(eq(posts.slug, slug), eq(posts.status, "published"), lte(posts.publishedAt, now)))
      .limit(1);
    return rows[0] ?? null;
  },
  ["post-by-slug"],
  { revalidate: 300, tags: ["posts"] },
);

export async function getPostBySlug(slug: string) {
  return getPostBySlugCached(slug);
}

export async function getPublicHome() {
  return getCachedPublicHome();
}

export async function getPublicData() {
  return getCachedPublicHome();
}

const SITE_URL = process.env.SITE_URL || "https://viremarca-academia-1.vercel.app";
const OG_IMAGE = {
  url: SITE_URL + "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Academia Demo VireMarca",
};

export function publicMetadata(
  settings: Awaited<ReturnType<typeof getCachedPublicHome>>["settings"],
  pageTitle: string,
  fallbackDescription: string,
  pathname: string,
): Metadata {
  const description = settings?.seoDescription || fallbackDescription;
  const url = new URL(pathname, SITE_URL).toString();
  return {
    title: pageTitle,
    description,
    alternates: { canonical: url },
    twitter: { card: "summary_large_image", title: pageTitle, description, images: [OG_IMAGE.url] },
    openGraph: { title: pageTitle, description, type: "website", url, images: [OG_IMAGE] },
  };
}

export function homeMetadata(
  settings: Awaited<ReturnType<typeof getCachedPublicHome>>["settings"],
): Metadata {
  const title = settings?.seoTitle || settings?.name || "Academia Demo VireMarca";
  const description = settings?.seoDescription || "Performance, força e movimento.";
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: SITE_URL },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
    openGraph: { title, description, type: "website", url: SITE_URL, images: [OG_IMAGE] },
  };
}
