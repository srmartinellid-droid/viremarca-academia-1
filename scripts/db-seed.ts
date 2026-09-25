/**
 * Seed 100% FICTÍCIO ("Academia Demo VireMarca"). Nenhum dado real.
 * Só roda com SEED_TARGET=dev para nunca atingir a branch de produção por engano.
 * Idempotente: limpa as tabelas de conteúdo e reinsere. NÃO toca em usuários nem leads reais.
 */
import "./_env";
import { sql } from "drizzle-orm";
import { createStandaloneDb } from "../src/db/standalone";
import * as s from "../src/db/schema";
import { seedData as d } from "./seed-data";

async function main() {
  if (process.env.SEED_TARGET !== "dev") {
    throw new Error("Seed bloqueado: defina SEED_TARGET=dev (nunca rode seed na produção)");
  }
  const { db, pool } = createStandaloneDb();
  try {
    await db.transaction(async (tx) => {
      await tx.execute(sql`truncate table
        class_schedule, modalities, instructors, plans, hero_slides, stats, home_sections,
        gallery_items, posts, post_categories, testimonials, faqs, opening_exceptions, site_settings
        restart identity cascade`);

      await tx.insert(s.siteSettings).values(d.settings);
      await tx.insert(s.homeSections).values(d.homeSections);
      await tx.insert(s.heroSlides).values(d.heroSlides);
      await tx.insert(s.stats).values(d.stats);

      const mods = await tx.insert(s.modalities).values(d.modalities).returning();
      const insts = await tx.insert(s.instructors).values(d.instructors).returning();
      const bySlug = Object.fromEntries(mods.map((m) => [m.slug, m.id]));
      await tx.insert(s.classSchedule).values(
        d.schedule.map((c, i) => ({
          modalityId: bySlug[c.modality]!,
          instructorId: insts[i % insts.length]!.id,
          weekday: c.weekday,
          startsAt: c.start,
          endsAt: c.end,
          room: c.room,
        })),
      );

      await tx.insert(s.plans).values(d.plans);
      await tx.insert(s.galleryItems).values(d.gallery);
      const cats = await tx.insert(s.postCategories).values(d.categories).returning();
      await tx
        .insert(s.posts)
        .values(d.posts.map((p, i) => ({ ...p, categoryId: cats[i % cats.length]!.id })));
      await tx.insert(s.testimonials).values(d.testimonials);
      await tx.insert(s.faqs).values(d.faqs);
    });
    console.log("[seed] conteúdo demo inserido");
  } finally {
    await pool.end();
  }
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
