"use server";

import { asc, eq, gt, lt } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { auditLog, plans } from "@/db/schema";
import { assertRole } from "@/core/auth/guards";

const schema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(100),
  period: z.enum(["mensal", "trimestral", "semestral", "anual", "avulso"]),
  price: z.coerce.number().min(0).max(999999),
  benefits: z.string().max(2000),
  highlighted: z.enum(["on", "off"]).default("off"),
  badge: z.string().max(80),
  ctaLabel: z.string().max(100),
  active: z.enum(["on", "off"]).default("off"),
  sortOrder: z.coerce.number().int().min(0),
});

export async function mutatePlan(formData: FormData) {
  const actor = await assertRole("staff");
  const intent = String(formData.get("intent") || "save");
  const id = String(formData.get("id") || "");
  const current = id ? (await db.select().from(plans).where(eq(plans.id, id)).limit(1))[0] : null;
  if (["delete", "up", "down", "toggle"].includes(intent)) {
    if (!current) throw new Error("Plano não encontrado.");
    if (intent === "delete") await db.delete(plans).where(eq(plans.id, id));
    if (intent === "toggle") await db.update(plans).set({ active: !current.active, updatedBy: actor.id }).where(eq(plans.id, id));
    if (intent === "up" || intent === "down") {
      const other = intent === "up"
        ? (await db.select().from(plans).where(lt(plans.sortOrder, current.sortOrder)).orderBy(asc(plans.sortOrder)).limit(1))[0]
        : (await db.select().from(plans).where(gt(plans.sortOrder, current.sortOrder)).orderBy(asc(plans.sortOrder)).limit(1))[0];
      if (other) {
        await db.update(plans).set({ sortOrder: other.sortOrder, updatedBy: actor.id }).where(eq(plans.id, current.id));
        await db.update(plans).set({ sortOrder: current.sortOrder, updatedBy: actor.id }).where(eq(plans.id, other.id));
      }
    }
    await db.insert(auditLog).values({ actorId: actor.id, action: intent, entity: "plan", entityId: id });
    revalidateTag("plans");
    return;
  }
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error("Dados do plano inválidos.");
  const d = parsed.data;
  const entityId = d.id || crypto.randomUUID();
  if (d.highlighted === "on") {
    await db.update(plans).set({ highlighted: false, updatedBy: actor.id });
  }
  const values = {
    name: d.name, period: d.period, priceCents: Math.round(d.price * 100),
    benefits: d.benefits.split("\n").map((v) => v.trim()).filter(Boolean),
    highlighted: d.highlighted === "on", badge: d.badge || null, ctaLabel: d.ctaLabel || null,
    active: d.active === "on", sortOrder: d.sortOrder, updatedBy: actor.id,
  };
  if (d.id) await db.update(plans).set(values).where(eq(plans.id, d.id));
  else await db.insert(plans).values({ ...values, id: entityId, createdBy: actor.id });
  await db.insert(auditLog).values({ actorId: actor.id, action: d.id ? "update" : "create", entity: "plan", entityId });
  revalidateTag("plans");
}
