"use server";

import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { auditLog, homeSections } from "@/db/schema";
import { assertRole } from "@/core/auth/guards";

const schema = z.object({
  key: z.string().min(1).max(100),
  active: z.enum(["on", "off"]),
  sortOrder: z.coerce.number().int().min(0),
});

export async function mutateSection(formData: FormData) {
  const actor = await assertRole("staff");
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error("Dados da seção inválidos.");
  const d = parsed.data;
  await db.update(homeSections).set({ active: d.active === "on", sortOrder: d.sortOrder, updatedBy: actor.id }).where(eq(homeSections.key, d.key));
  await db.insert(auditLog).values({ actorId: actor.id, action: "update", entity: "home_section", entityId: d.key });
  revalidateTag("settings");
}
