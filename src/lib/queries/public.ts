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
  plans,
  posts,
  siteSettings,
  stats,
  testimonials,
} from "@/db/schema";

const PUBLIC_TAGS = [
  "settings",
  "hero",
  "modalities",
  "schedule",
  "plans",
  "posts",
  "gallery",
  "team",
  "faq",
  "testimonials",
];

const getCachedPublicHome = unstable_cache(
  async () => {
    const now = new Date();

    const [
      settings,
      sections,
      hero,
      statRows,
      modalityRows,
      instructorRows,
      scheduleRows,
      planRows,
      galleryRows,
      postRows,
      testimonialRows,
      faqRows,
    ] = await Promise.all([
      db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.id, 1))
        .limit(1),
      db
        .select()
        .from(homeSections)
        .where(eq(homeSections.active, true))
        .orderBy(asc(homeSections.sortOrder)),
      db
        .select()
        .from(heroSlides)
        .where(eq(heroSlides.active, true))
        .orderBy(asc(heroSlides.sortOrder)),
      db
        .select()
        .from(stats)
        .where(eq(stats.active, true))
        .orderBy(asc(stats.sortOrder)),
      db
        .select()
        .from(modalities)
        .where(eq(modalities.active, true))
        .orderBy(asc(modalities.sortOrder)),
      db
        .select()
        .from(instructors)
        .where(eq(instructors.active, true))
        .orderBy(asc(instructors.sortOrder)),
      db
        .select()
        .from(classSchedule)
        .where(eq(classSchedule.active, true))
        .orderBy(asc(classSchedule.weekday), asc(classSchedule.startsAt)),
      db
        .select()
        .from(plans)
        .where(eq(plans.active, true))
        .orderBy(asc(plans.sortOrder)),
      db
        .select()
        .from(galleryItems)
        .where(eq(galleryItems.active, true))
        .orderBy(asc(galleryItems.sortOrder)),
      db
        .select()
        .from(posts)
        .where(
          and(eq(posts.status, "published"), lte(posts.publishedAt, now)),
        )
        .orderBy(desc(posts.publishedAt))
        .limit(3),
      db
        .select()
        .from(testimonials)
        .where(eq(testimonials.active, true))
        .orderBy(asc(testimonials.sortOrder)),
      db
        .select()
        .from(faqs)
        .where(eq(faqs.active, true))
        .orderBy(asc(faqs.sortOrder)),
    ]);

    return {
      settings: settings[0] ?? null,
      sections,
      hero,
      stats: statRows,
      modalities: modalityRows,
      instructors: instructorRows,
      schedule: scheduleRows,
      plans: planRows,
      gallery: galleryRows,
      posts: postRows,
      testimonials: testimonialRows,
      faqs: faqRows,
    };
  },
  ["public-home"],
  {
    revalidate: 300,
    tags: PUBLIC_TAGS,
  },
);

export async function getPublicHome() {
  return getCachedPublicHome();
}

export async function getPublicData() {
  return getCachedPublicHome();
}

export function publicMetadata(
  settings: Awaited<ReturnType<typeof getCachedPublicHome>>["settings"],
  fallbackTitle: string,
  fallbackDescription: string,
): Metadata {
  const title = settings?.seoTitle || settings?.name || fallbackTitle;
  const description = settings?.seoDescription || fallbackDescription;

  return {
    title,
    description,
  };
}
