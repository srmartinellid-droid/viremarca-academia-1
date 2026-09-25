"use server";

import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { auditLog, heroSlides } from "@/db/schema";
import { assertRole } from "@/core/auth/guards";

const schema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3).max(180),
  subtitle: z.string().max(300),
  ctaLabel: z.string().max(80),
  ctaHref: z.string().max(200),
});

export async function updateHero(formData: FormData) {
  const actor = await assertRole("staff");
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error("Dados inválidos.");
  await db.update(heroSlides).set({
    title: parsed.data.title,
    subtitle: parsed.data.subtitle,
    ctaLabel: parsed.data.ctaLabel,
    ctaHref: parsed.data.ctaHref,
    updatedBy: actor.id,
  }).where(eq(heroSlides.id, parsed.data.id));
  await db.insert(auditLog).values({ actorId: actor.id, action: "update", entity: "hero_slide", entityId: parsed.data.id });
  revalidateTag("hero");
}
