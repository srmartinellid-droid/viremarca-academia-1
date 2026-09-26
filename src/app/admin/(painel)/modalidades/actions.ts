"use server";

import { asc, eq, gt, lt } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { auditLog, modalities } from "@/db/schema";
import { assertRole } from "@/core/auth/guards";
import { slugify } from "@/lib/admin/slugify";

const schema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(100),
  slug: z.string().trim().max(120).optional(),
  summary: z.string().max(500),
  description: z.string().max(5000),
  level: z.enum(["todos", "iniciante", "intermediario", "avancado"]),
  durationMin: z.coerce.number().int().min(1).max(300),
  imageUrl: z.string().max(1000),
  imageAlt: z.string().max(180),
  active: z.enum(["on", "off"]).default("off"),
  sortOrder: z.coerce.number().int().min(0),
});

export async function mutateModality(formData: FormData) {
  const actor = await assertRole("staff");
  const intent = String(formData.get("intent") || "save");
  const id = String(formData.get("id") || "");
  const current = id ? (await db.select().from(modalities).where(eq(modalities.id, id)).limit(1))[0] : null;
  if (intent === "delete" || intent === "up" || intent === "down" || intent === "toggle") {
    if (!current) throw new Error("Modalidade não encontrada.");
    if (intent === "delete") await db.delete(modalities).where(eq(modalities.id, id));
    if (intent === "toggle") await db.update(modalities).set({ active: !current.active, updatedBy: actor.id }).where(eq(modalities.id, id));
    if (intent === "up" || intent === "down") await swapOrder(modalities, current, intent, actor.id);
    await db.insert(auditLog).values({ actorId: actor.id, action: intent, entity: "modality", entityId: id });
    revalidateTag("modalities");
    return;
  }
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error("Dados da modalidade inválidos.");
  const d = parsed.data;
  const entityId = d.id || crypto.randomUUID();
  const values = {
    name: d.name, slug: slugify(d.slug || d.name), summary: d.summary || null, description: d.description || null,
    level: d.level, durationMin: d.durationMin, imageUrl: d.imageUrl || null, imageAlt: d.imageAlt || null,
    active: d.active === "on", sortOrder: d.sortOrder, updatedBy: actor.id,
  };
  if (d.id) await db.update(modalities).set(values).where(eq(modalities.id, d.id));
  else await db.insert(modalities).values({ ...values, id: entityId, createdBy: actor.id });
  await db.insert(auditLog).values({ actorId: actor.id, action: d.id ? "update" : "create", entity: "modality", entityId });
  revalidateTag("modalities");
}

async function swapOrder(table: typeof modalities, current: typeof modalities.$inferSelect, intent: string, actorId: string) {
  const other = intent === "up"
    ? (await db.select().from(table).where(lt(table.sortOrder, current.sortOrder)).orderBy(asc(table.sortOrder)).limit(1))[0]
    : (await db.select().from(table).where(gt(table.sortOrder, current.sortOrder)).orderBy(asc(table.sortOrder)).limit(1))[0];
  if (!other) return;
  await db.update(table).set({ sortOrder: other.sortOrder, updatedBy: actorId }).where(eq(table.id, current.id));
  await db.update(table).set({ sortOrder: current.sortOrder, updatedBy: actorId }).where(eq(table.id, other.id));
}
