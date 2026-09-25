/**
 * Cria o owner inicial a partir de ADMIN_INITIAL_EMAIL / ADMIN_INITIAL_PASSWORD.
 * Idempotente: se o e-mail já existe, não altera nada.
 * O owner nasce com must_change_password = true (troca obrigatória no 1º login).
 * A senha NUNCA fica no código nem em migration.
 */
import "./_env";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";
import { createStandaloneDb } from "../src/db/standalone";
import { account, user } from "../src/db/schema";

async function main() {
  const email = process.env.ADMIN_INITIAL_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_INITIAL_PASSWORD;
  if (!email || !password) throw new Error("Defina ADMIN_INITIAL_EMAIL e ADMIN_INITIAL_PASSWORD");

  const { db, pool } = createStandaloneDb();
  try {
    const existing = await db.select({ id: user.id }).from(user).where(eq(user.email, email));
    if (existing.length) {
      console.log(`[bootstrap] owner ${email} já existe — nada alterado`);
      return;
    }
    const id = randomUUID();
    const hash = await hashPassword(password);
    await db.transaction(async (tx) => {
      await tx.insert(user).values({
        id,
        name: "Administrador",
        email,
        emailVerified: true,
        role: "owner",
        mustChangePassword: true,
      });
      await tx.insert(account).values({
        id: randomUUID(),
        accountId: id,
        providerId: "credential",
        userId: id,
        password: hash,
      });
    });
    console.log(`[bootstrap] owner ${email} criado (troca de senha obrigatória no 1º login)`);
  } finally {
    await pool.end();
  }
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
