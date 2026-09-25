/** Recria o schema do zero numa base de DEV/teste. Recusa rodar sem SEED_TARGET=dev. */
import "./_env";
import { execSync } from "node:child_process";
import { createStandaloneDb } from "../src/db/standalone";

async function main() {
  if (process.env.SEED_TARGET !== "dev") throw new Error("Reset bloqueado: defina SEED_TARGET=dev");
  const { pool } = createStandaloneDb();
  await pool.query(
    "drop schema if exists public cascade; drop schema if exists drizzle cascade; create schema public;",
  );
  await pool.end();
  execSync("npm run db:migrate && npm run db:seed", { stdio: "inherit" });
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
