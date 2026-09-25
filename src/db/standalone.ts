/** Cliente para scripts (migrate/seed/bootstrap/testes), sem "server-only". */
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export function createStandaloneDb(
  connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL,
) {
  if (!connectionString) throw new Error("DATABASE_URL(_UNPOOLED) não definida");
  const pool = new Pool({
    connectionString,
    max: 2,
    ssl: /sslmode=require|neon\.tech/.test(connectionString)
      ? { rejectUnauthorized: true }
      : undefined,
  });
  return { db: drizzle(pool, { schema, casing: "snake_case" }), pool };
}
