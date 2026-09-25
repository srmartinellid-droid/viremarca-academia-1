import "server-only";
import { createHash } from "node:crypto";
import { sql } from "drizzle-orm";
import { db } from "@/db";

/** Hash não reversível para IP/UA/e-mail em chaves de rate limit e leads (LGPD). */
export function hashValue(value: string) {
  const salt = process.env.BETTER_AUTH_SECRET ?? "dev-salt";
  return createHash("sha256").update(`${salt}:${value}`).digest("hex").slice(0, 32);
}

/** Retorna true se permitido. Atômico no Postgres (função rate_limit_hit). */
export async function rateLimit(key: string, limit: number, windowSeconds: number) {
  const r = await db.execute<{ allowed: boolean }>(
    sql`select public.rate_limit_hit(${key}, ${limit}, ${windowSeconds}) as allowed`,
  );
  return Boolean(r.rows[0]?.allowed);
}

export const LIMITS = {
  login: { limit: 5, window: 15 * 60 },
  lead: { limit: 3, window: 10 * 60 },
  analytics: { limit: 120, window: 60 },
} as const;
