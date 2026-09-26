"use server";

import { asc, eq, gt, lt } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { auditLog, faqs } from "@/db/schema";
import { assertRole } from "@/core/auth/guards";

const schema = z.object({
  id: z.string().uuid().optional(),
  question: z.string().trim().min(5).max(300),
  answer: z.string().trim().min(5).max(2000),
  active: z.enum(["on", "off"]).default("off"),
  sortOrder: z.coerce.number().int().min(0),
});

export async function mutateFaq(formData: FormData) {
  const actor = await assertRole("staff");
  const intent = String(formData.get("intent") || "save");
  const id = String(formData.get("id") || "");
  const current = id ? (await db.select().from(faqs).where(eq(faqs.id, id)).limit(1))[0] : null;
  if (["delete", "up", "down", "toggle"].includes(intent)) {
    if (!current) throw new Error("FAQ não encontrada.");
    if (intent === "delete") await db.delete(faqs).where(eq(faqs.id, id));
    if (intent === "toggle") await db.update(faqs).set({ active: !current.active, updatedBy: actor.id }).where(eq(faqs.id, id));
    if (intent === "up" || intent === "down") {
      const other = intent === "up"
        ? (await db.select().from(faqs).where(lt(faqs.sortOrder, current.sortOrder)).orderBy(asc(faqs.sortOrder)).limit(1))[0]
        : (await db.select().from(faqs).where(gt(faqs.sortOrder, current.sortOrder)).orderBy(asc(faqs.sortOrder)).limit(1))[0];
      if (other) {
        await db.update(faqs).set({ sortOrder: other.sortOrder, updatedBy: actor.id }).where(eq(faqs.id, id));
        await db.update(faqs).set({ sortOrder: current.sortOrder, updatedBy: actor.id }).where(eq(faqs.id, other.id));
      }
    }
    await db.insert(auditLog).values({ actorId: actor.id, action: intent, entity: "faq", entityId: id });
    revalidateTag("faq");
    return;
  }
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error("Dados da FAQ inválidos.");
  const d = parsed.data;
  const entityId = d.id || crypto.randomUUID();
  const values = { question: d.question, answer: d.answer, active: d.active === "on", sortOrder: d.sortOrder, updatedBy: actor.id };
  if (d.id) await db.update(faqs).set(values).where(eq(faqs.id, d.id));
  else await db.insert(faqs).values({ ...values, id: entityId, createdBy: actor.id });
  await db.insert(auditLog).values({ actorId: actor.id, action: d.id ? "update" : "create", entity: "faq", entityId });
  revalidateTag("faq");
}
