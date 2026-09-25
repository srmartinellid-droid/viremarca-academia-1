"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { auditLog, user } from "@/db/schema";
import { assertRole } from "./guards";

/**
 * Chamar DEPOIS de `authClient.changePassword({ ..., revokeOtherSessions: true })` dar certo.
 * Libera o acesso ao painel (zera must_change_password) e registra auditoria.
 */
export async function completePasswordChange() {
  const u = await assertRole("staff", { allowPendingPassword: true });
  await db.update(user).set({ mustChangePassword: false }).where(eq(user.id, u.id));
  await db
    .insert(auditLog)
    .values({ actorId: u.id, action: "password_change", entity: "user", entityId: u.id });
  return { ok: true as const };
}
