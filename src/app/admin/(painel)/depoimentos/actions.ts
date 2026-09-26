"use server";

import { asc, eq, gt, lt } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { auditLog, testimonials } from "@/db/schema";
import { assertRole } from "@/core/auth/guards";

const schema = z.object({
  id: z.string().uuid().optional(),
  authorName: z.string().trim().min(2).max(120),
  authorInfo: z.string().max(160),
  quote: z.string().trim().min(5).max(1000),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  isDemo: z.enum(["on", "off"]).default("off"),
  active: z.enum(["on", "off"]).default("off"),
  sortOrder: z.coerce.number().int().min(0),
});

export async function mutateTestimonial(formData: FormData) {
  const actor = await assertRole("staff");
  const intent = String(formData.get("intent") || "save");
  const id = String(formData.get("id") || "");
  const current = id ? (await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1))[0] : null;
  if (["delete", "up", "down", "toggle"].includes(intent)) {
    if (!current) throw new Error("Depoimento não encontrado.");
    if (intent === "delete") await db.delete(testimonials).where(eq(testimonials.id, id));
    if (intent === "toggle") await db.update(testimonials).set({ active: !current.active, updatedBy: actor.id }).where(eq(testimonials.id, id));
    if (intent === "up" || intent === "down") {
      const other = intent === "up"
        ? (await db.select().from(testimonials).where(lt(testimonials.sortOrder, current.sortOrder)).orderBy(asc(testimonials.sortOrder)).limit(1))[0]
        : (await db.select().from(testimonials).where(gt(testimonials.sortOrder, current.sortOrder)).orderBy(asc(testimonials.sortOrder)).limit(1))[0];
      if (other) {
        await db.update(testimonials).set({ sortOrder: other.sortOrder, updatedBy: actor.id }).where(eq(testimonials.id, id));
        await db.update(testimonials).set({ sortOrder: current.sortOrder, updatedBy: actor.id }).where(eq(testimonials.id, other.id));
      }
    }
    await db.insert(auditLog).values({ actorId: actor.id, action: intent, entity: "testimonial", entityId: id });
    revalidateTag("testimonials");
    return;
  }
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error("Dados do depoimento inválidos.");
  const d = parsed.data;
  const entityId = d.id || crypto.randomUUID();
  const values = {
    authorName: d.authorName, authorInfo: d.authorInfo || null, quote: d.quote,
    rating: d.rating || null, isDemo: d.isDemo === "on", active: d.active === "on", sortOrder: d.sortOrder,
    updatedBy: actor.id,
  };
  if (d.id) await db.update(testimonials).set(values).where(eq(testimonials.id, d.id));
  else await db.insert(testimonials).values({ ...values, id: entityId, createdBy: actor.id });
  await db.insert(auditLog).values({ actorId: actor.id, action: d.id ? "update" : "create", entity: "testimonial", entityId });
  revalidateTag("testimonials");
}
