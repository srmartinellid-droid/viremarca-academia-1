"use server";

import { asc, eq, gt, lt } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { auditLog, instructors } from "@/db/schema";
import { assertRole } from "@/core/auth/guards";
import { deleteBlobIfUnused } from "@/core/media/actions";

const schema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(120),
  role: z.string().max(120),
  specialties: z.string().max(300),
  bio: z.string().max(1500),
  photoUrl: z.string().max(1000),
  photoAlt: z.string().max(180),
  professionalRegistry: z.string().max(80),
  active: z.enum(["on", "off"]).default("off"),
  sortOrder: z.coerce.number().int().min(0),
});

export async function mutateInstructor(formData: FormData) {
  const actor = await assertRole("staff");
  const intent = String(formData.get("intent") || "save");
  const id = String(formData.get("id") || "");
  const current = id ? (await db.select().from(instructors).where(eq(instructors.id, id)).limit(1))[0] : null;
  if (["delete", "up", "down", "toggle"].includes(intent)) {
    if (!current) throw new Error("Professor não encontrado.");
    if (intent === "delete") { await db.delete(instructors).where(eq(instructors.id, id)); await deleteBlobIfUnused(current.photoUrl); }
    if (intent === "toggle") await db.update(instructors).set({ active: !current.active, updatedBy: actor.id }).where(eq(instructors.id, id));
    if (intent === "up" || intent === "down") {
      const other = intent === "up"
        ? (await db.select().from(instructors).where(lt(instructors.sortOrder, current.sortOrder)).orderBy(asc(instructors.sortOrder)).limit(1))[0]
        : (await db.select().from(instructors).where(gt(instructors.sortOrder, current.sortOrder)).orderBy(asc(instructors.sortOrder)).limit(1))[0];
      if (other) {
        await db.update(instructors).set({ sortOrder: other.sortOrder, updatedBy: actor.id }).where(eq(instructors.id, id));
        await db.update(instructors).set({ sortOrder: current.sortOrder, updatedBy: actor.id }).where(eq(instructors.id, other.id));
      }
    }
    await db.insert(auditLog).values({ actorId: actor.id, action: intent, entity: "instructor", entityId: id });
    revalidateTag("team");
    return;
  }
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error("Dados do professor inválidos.");
  const d = parsed.data;
  const entityId = d.id || crypto.randomUUID();
  const values = {
    name: d.name, role: d.role || null, specialties: d.specialties || null, bio: d.bio || null,
    photoUrl: d.photoUrl || null, photoAlt: d.photoAlt || null, professionalRegistry: d.professionalRegistry || null,
    active: d.active === "on", sortOrder: d.sortOrder, updatedBy: actor.id,
  };
  if (d.id) await db.update(instructors).set(values).where(eq(instructors.id, d.id));
  else await db.insert(instructors).values({ ...values, id: entityId, createdBy: actor.id });\n  if (current && current.photoUrl !== values.photoUrl) await deleteBlobIfUnused(current.photoUrl);
  await db.insert(auditLog).values({ actorId: actor.id, action: d.id ? "update" : "create", entity: "instructor", entityId });
  revalidateTag("team");
}
