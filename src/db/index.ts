import "server-only";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

/**
 * Cliente único do banco (Neon em dev/prod, Postgres local nos testes).
 * node-postgres funciona com o endpoint pooled do Neon no runtime Node da Vercel.
 * O browser NUNCA acessa o banco: este módulo é "server-only".
 */
const globalForDb = globalThis as unknown as { __academiaPool?: Pool };

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL não definida");
  return new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 10_000,
    ssl: /sslmode=require|neon\.tech/.test(connectionString)
      ? { rejectUnauthorized: true }
      : undefined,
  });
}

export const pool = globalForDb.__academiaPool ?? createPool();
if (process.env.NODE_ENV !== "production") globalForDb.__academiaPool = pool;

export const db = drizzle(pool, { schema, casing: "snake_case" });
export type Db = typeof db;
export { schema };
