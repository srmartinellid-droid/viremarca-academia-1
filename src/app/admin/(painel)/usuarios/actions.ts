"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { auditLog, user } from "@/db/schema";
import { assertRole } from "@/core/auth/guards";

const createSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email().max(160),
  tempPassword: z.string().min(10).max(128),
});

const deactivateSchema = z.object({ id: z.string().min(1) });

export async function createStaffUser(formData: FormData) {
  const actor = await assertRole("owner");
  const parsed = createSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error("Dados do novo staff inválidos.");

  type AuthActions = {
    createStaffUser(input: {
      name: string;
      email: string;
      tempPassword: string;
    }): Promise<{ id: string }>;
  };
  const authActions = (await import("@/core/auth/actions")) as unknown as AuthActions;
  const created = await authActions.createStaffUser(parsed.data);

  await db.insert(auditLog).values({
    actorId: actor.id,
    action: "create",
    entity: "user",
    entityId: created.id,
  });
  revalidatePath("/admin/usuarios");
}

export async function deactivateUser(formData: FormData) {
  const actor = await assertRole("owner");
  const parsed = deactivateSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error("Usuário inválido.");
  if (parsed.data.id === actor.id) throw new Error("O owner atual não pode ser desativado.");

  await db.update(user).set({ active: false }).where(eq(user.id, parsed.data.id));
  await db.insert(auditLog).values({
    actorId: actor.id,
    action: "deactivate",
    entity: "user",
    entityId: parsed.data.id,
  });
  revalidatePath("/admin/usuarios");
}
