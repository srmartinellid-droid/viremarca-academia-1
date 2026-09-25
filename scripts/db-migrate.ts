import "./_env";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createStandaloneDb } from "../src/db/standalone";

async function main() {
  const { db, pool } = createStandaloneDb();
  const host = new URL(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!).host;
  console.log(`[migrate] aplicando migrations em ${host}`);
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("[migrate] ok");
  await pool.end();
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
