/**
 * Integração com Postgres real (local ou branch Neon descartável).
 * Rode com TEST_DATABASE_URL apontando para uma base VAZIA de teste.
 * Sem TEST_DATABASE_URL o teste é pulado (não toca Neon por acidente).
 */
import { execSync } from "node:child_process";
import { Pool } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const url = process.env.TEST_DATABASE_URL;
const d = url ? describe : describe.skip;

d("banco: migrations + seed + regras", () => {
  let pool: Pool;
  beforeAll(() => {
    const env = {
      ...process.env,
      DATABASE_URL: url,
      DATABASE_URL_UNPOOLED: url,
      SEED_TARGET: "dev",
    };
    execSync("npm run db:reset:dev", { env, stdio: "pipe" });
    pool = new Pool({ connectionString: url });
  }, 120_000);
  afterAll(async () => pool?.end());

  it("recria do zero e roda o seed", async () => {
    const r = await pool.query(
      "select (select count(*) from modalities)::int m, (select count(*) from plans)::int p",
    );
    expect(r.rows[0]).toEqual({ m: 6, p: 3 });
  });

  it("site_settings é registro único", async () => {
    await expect(pool.query("insert into site_settings(id,name) values (2,'x')")).rejects.toThrow();
  });

  it("analytics aceita só eventos da allowlist", async () => {
    await pool.query("insert into analytics_events(name) values ('whatsapp_click')");
    await expect(
      pool.query("insert into analytics_events(name) values ('hack')"),
    ).rejects.toThrow();
  });

  it("rate_limit_hit bloqueia após o limite", async () => {
    const q = () =>
      pool.query("select public.rate_limit_hit('t:1', 2, 60) ok").then((r) => r.rows[0].ok);
    expect([await q(), await q(), await q()]).toEqual([true, true, false]);
  });

  it("updated_at é atualizado por trigger", async () => {
    const before = (await pool.query("select updated_at from site_settings")).rows[0].updated_at;
    await new Promise((r) => setTimeout(r, 20));
    await pool.query("update site_settings set slogan = 'x'");
    const after = (await pool.query("select updated_at from site_settings")).rows[0].updated_at;
    expect(after.getTime()).toBeGreaterThan(before.getTime());
  });

  it("post publicado exige data", async () => {
    await expect(
      pool.query("insert into posts(title,slug,status) values ('x','x-slug','published')"),
    ).rejects.toThrow();
  });
});
