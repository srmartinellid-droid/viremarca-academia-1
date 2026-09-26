"use server";

import { asc, eq, gt, lt } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { auditLog, classSchedule } from "@/db/schema";
import { assertRole } from "@/core/auth/guards";

const schema = z.object({
  id: z.string().uuid().optional(),
  modalityId: z.string().uuid(),
  instructorId: z.string().uuid().optional().or(z.literal("")),
  weekday: z.coerce.number().int().min(0).max(6),
  startsAt: z.string().regex(/^\d{2}:\d{2}$/),
  endsAt: z.string().regex(/^\d{2}:\d{2}$/),
  room: z.string().max(100),
  active: z.enum(["on", "off"]).default("off"),
});

function minutes(value: string) {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
}

export async function mutateSchedule(formData: FormData) {
  const actor = await assertRole("staff");
  const intent = String(formData.get("intent") || "save");
  const id = String(formData.get("id") || "");
  const current = id ? (await db.select().from(classSchedule).where(eq(classSchedule.id, id)).limit(1))[0] : null;

  if (["delete", "up", "down", "toggle"].includes(intent)) {
    if (!current) throw new Error("Horário não encontrado.");
    if (intent === "delete") await db.delete(classSchedule).where(eq(classSchedule.id, id));
    if (intent === "toggle") await db.update(classSchedule).set({ active: !current.active, updatedBy: actor.id }).where(eq(classSchedule.id, id));
    if (intent === "up" || intent === "down") {
      const other = intent === "up"
        ? (await db.select().from(classSchedule).where(lt(classSchedule.startsAt, current.startsAt)).orderBy(asc(classSchedule.startsAt)).limit(1))[0]
        : (await db.select().from(classSchedule).where(gt(classSchedule.startsAt, current.startsAt)).orderBy(asc(classSchedule.startsAt)).limit(1))[0];
      if (other) {
        await db.update(classSchedule).set({ startsAt: other.startsAt, endsAt: other.endsAt, updatedBy: actor.id }).where(eq(classSchedule.id, current.id));
        await db.update(classSchedule).set({ startsAt: current.startsAt, endsAt: current.endsAt, updatedBy: actor.id }).where(eq(classSchedule.id, other.id));
      }
    }
    await db.insert(auditLog).values({ actorId: actor.id, action: intent, entity: "class_schedule", entityId: id });
    revalidateTag("schedule");
    return;
  }

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success || minutes(parsed.data.endsAt) <= minutes(parsed.data.startsAt)) throw new Error("Fim deve ser depois do início.");
  const d = parsed.data;
  const entityId = d.id || crypto.randomUUID();
  const values = {
    modalityId: d.modalityId, instructorId: d.instructorId || null, weekday: d.weekday,
    startsAt: d.startsAt, endsAt: d.endsAt, room: d.room || null, active: d.active === "on", updatedBy: actor.id,
  };
  if (d.id) await db.update(classSchedule).set(values).where(eq(classSchedule.id, d.id));
  else await db.insert(classSchedule).values({ ...values, id: entityId, createdBy: actor.id });
  await db.insert(auditLog).values({ actorId: actor.id, action: d.id ? "update" : "create", entity: "class_schedule", entityId });
  revalidateTag("schedule");
}
