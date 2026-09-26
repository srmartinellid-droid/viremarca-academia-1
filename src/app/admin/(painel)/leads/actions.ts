"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { auditLog, leadEvents, leads } from "@/db/schema";
import { assertRole } from "@/core/auth/guards";

const schema = z.object({
  id: z.string().uuid(),
  status: z.enum(["novo", "em_contato", "matriculado", "perdido"]),
  note: z.string().trim().max(1000).optional(),
});

export async function updateLeadStatus(formData: FormData) {
  const actor = await assertRole("staff");
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return;
  const { id, status, note } = parsed.data;
  const current = (
    await db.select({ status: leads.status }).from(leads).where(eq(leads.id, id))
  )[0];
  if (!current) return;
  await db
    .update(leads)
    .set({ status, ...(note ? { notes: note } : {}) })
    .where(eq(leads.id, id));
  await db.insert(leadEvents).values({
    leadId: id,
    type: current.status === status ? "note_added" : "status_changed",
    fromStatus: current.status,
    toStatus: status,
    note: note || null,
    actorId: actor.id,
  });
  await db
    .insert(auditLog)
    .values({ actorId: actor.id, action: "update", entity: "lead", entityId: id });
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}
