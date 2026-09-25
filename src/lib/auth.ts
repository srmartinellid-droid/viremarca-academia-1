import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { sendEmail } from "@/core/email";

/**
 * Better Auth sobre o Neon (Drizzle).
 * - Cadastro público DESLIGADO: usuários só nascem pelo bootstrap (owner) ou pelo admin (staff).
 * - Senha: hash scrypt do Better Auth; mínimo 10 caracteres.
 * - Rate limit do login persistido no banco (tabela rate_limits via storage "database" não é
 *   usada: aplicamos o nosso em src/core/security/rate-limit.ts nas actions de login).
 */
export const auth = betterAuth({
  appName: "Academia Demo VireMarca",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 10,
    maxPasswordLength: 128,
    revokeSessionsOnPasswordReset: true,
    resetPasswordTokenExpiresIn: 60 * 30,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Redefinição de senha — painel da academia",
        text: `Para redefinir sua senha, acesse (válido por 30 min):\n${url}\n\nSe não foi você, ignore este e-mail.`,
      });
    },
  },
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "staff", input: false },
      mustChangePassword: { type: "boolean", required: false, defaultValue: false, input: false },
      active: { type: "boolean", required: false, defaultValue: true, input: false },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    database: { generateId: () => crypto.randomUUID() },
  },
  rateLimit: { enabled: true, window: 60, max: 30 },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
