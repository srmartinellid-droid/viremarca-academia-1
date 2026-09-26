"use server";

import { asc, eq, gt, lt } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { auditLog, stats } from "@/db/schema";
import { assertRole } from "@/core/auth/guards";

const schema = z.object({
  id: z.string().uuid().optional(),
  value: z.string().trim().min(1).max(40),
  suffix: z.string().max(20),
  label: z.string().trim().min(2).max(100),
  active: z.enum(["on", "off"]).default("off"),
  sortOrder: z.coerce.number().int().min(0),
});

export async function mutateStat(formData: FormData) {
  const actor = await assertRole("staff");
  const intent = String(formData.get("intent") || "save");
  const id = String(formData.get("id") || "");
  const current = id ? (await db.select().from(stats).where(eq(stats.id, id)).limit(1))[0] : null;
  if (["delete", "up", "down", "toggle"].includes(intent)) {
    if (!current) throw new Error("Número não encontrado.");
    if (intent === "delete") await db.delete(stats).where(eq(stats.id, id));
    if (intent === "toggle") await db.update(stats).set({ active: !current.active, updatedBy: actor.id }).where(eq(stats.id, id));
    if (intent === "up" || intent === "down") {
      const other = intent === "up"
        ? (await db.select().from(stats).where(lt(stats.sortOrder, current.sortOrder)).orderBy(asc(stats.sortOrder)).limit(1))[0]
        : (await db.select().from(stats).where(gt(stats.sortOrder, current.sortOrder)).orderBy(asc(stats.sortOrder)).limit(1))[0];
      if (other) {
        await db.update(stats).set({ sortOrder: other.sortOrder, updatedBy: actor.id }).where(eq(stats.id, id));
        await db.update(stats).set({ sortOrder: current.sortOrder, updatedBy: actor.id }).where(eq(stats.id, other.id));
      }
    }
    await db.insert(auditLog).values({ actorId: actor.id, action: intent, entity: "stat", entityId: id });
    revalidateTag("settings");
    return;
  }
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error("Dados do número inválidos.");
  const d = parsed.data;
  const entityId = d.id || crypto.randomUUID();
  const values = { value: d.value, suffix: d.suffix || null, label: d.label, active: d.active === "on", sortOrder: d.sortOrder, updatedBy: actor.id };
  if (d.id) await db.update(stats).set(values).where(eq(stats.id, d.id));
  else await db.insert(stats).values({ ...values, id: entityId, createdBy: actor.id });
  await db.insert(auditLog).values({ actorId: actor.id, action: d.id ? "update" : "create", entity: "stat", entityId });
  revalidateTag("settings");
}
