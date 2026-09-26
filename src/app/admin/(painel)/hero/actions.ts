"use server";

import { asc, eq, gt, lt } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { auditLog, heroSlides } from "@/db/schema";
import { assertRole } from "@/core/auth/guards";

const schema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(3).max(180),
  subtitle: z.string().max(300),
  ctaLabel: z.string().max(80),
  ctaHref: z.string().max(200),
  imageDesktopUrl: z.string().max(1000),
  imageMobileUrl: z.string().max(1000),
  imageAlt: z.string().trim().min(2).max(180),
  active: z.enum(["on", "off"]).default("off"),
  sortOrder: z.coerce.number().int().min(0),
});

export async function mutateHero(formData: FormData) {
  const actor = await assertRole("staff");
  const intent = String(formData.get("intent") || "save");
  const id = String(formData.get("id") || "");

  if (intent === "delete" || intent === "up" || intent === "down" || intent === "toggle") {
    const idSchema = z.string().uuid().safeParse(id);
    if (!idSchema.success) throw new Error("ID inválido.");
    const current = (await db.select().from(heroSlides).where(eq(heroSlides.id, id)).limit(1))[0];
    if (!current) throw new Error("Slide não encontrado.");
    if (intent === "delete") await db.delete(heroSlides).where(eq(heroSlides.id, id));
    if (intent === "toggle") await db.update(heroSlides).set({ active: !current.active, updatedBy: actor.id }).where(eq(heroSlides.id, id));
    if (intent === "up" || intent === "down") {
      const other = intent === "up"
        ? (await db.select().from(heroSlides).where(lt(heroSlides.sortOrder, current.sortOrder)).orderBy(asc(heroSlides.sortOrder)).limit(1))[0]
        : (await db.select().from(heroSlides).where(gt(heroSlides.sortOrder, current.sortOrder)).orderBy(asc(heroSlides.sortOrder)).limit(1))[0];
      if (other) {
        await db.update(heroSlides).set({ sortOrder: other.sortOrder, updatedBy: actor.id }).where(eq(heroSlides.id, current.id));
        await db.update(heroSlides).set({ sortOrder: current.sortOrder, updatedBy: actor.id }).where(eq(heroSlides.id, other.id));
      }
    }
    await db.insert(auditLog).values({ actorId: actor.id, action: intent, entity: "hero_slide", entityId: id });
    revalidateTag("hero");
    return;
  }

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error("Dados do slide inválidos.");
  const d = parsed.data;
  const values = {
    title: d.title, subtitle: d.subtitle || null, ctaLabel: d.ctaLabel || null, ctaHref: d.ctaHref || null,
    imageDesktopUrl: d.imageDesktopUrl || null, imageMobileUrl: d.imageMobileUrl || null,
    imageAlt: d.imageAlt, active: d.active === "on", sortOrder: d.sortOrder, updatedBy: actor.id,
  };
  const entityId = d.id || crypto.randomUUID();
  if (d.id) await db.update(heroSlides).set(values).where(eq(heroSlides.id, d.id));
  else await db.insert(heroSlides).values({ ...values, id: entityId, createdBy: actor.id });
  await db.insert(auditLog).values({ actorId: actor.id, action: d.id ? "update" : "create", entity: "hero_slide", entityId });
  revalidateTag("hero");
}
