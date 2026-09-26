import { asc } from "drizzle-orm";

import { ActionButtons } from "@/components/admin/ActionButtons";
import { requireStaff } from "@/core/auth/guards";
import { db } from "@/db";
import { heroSlides } from "@/db/schema";
import { mutateHero } from "./actions";
import { HeroForm } from "./Form";

export default async function HeroPage() {
  await requireStaff();
  const hero = await db.select().from(heroSlides).orderBy(asc(heroSlides.sortOrder));
  return (
    <section>
      <div className="admin-heading">
        <div><span>CONTEÚDO</span><h1>Hero</h1></div>
        <HeroForm />
      </div>
      <div className="admin-list">
        {hero.map((slide) => (
          <article className="admin-panel" key={slide.id}>
            <div className="admin-row admin-row-head">
              <strong>{slide.title}</strong>
              <span>{slide.active ? "Ativo" : "Inativo"}</span>
              <span>#{slide.sortOrder}</span>
            </div>
            <HeroForm slide={slide as unknown as Record<string, unknown>} />
            <div className="admin-list-footer">
              <form action={mutateHero}>
                <input type="hidden" name="intent" value="toggle" />
                <input type="hidden" name="id" value={slide.id} />
                <button className="btn small" type="submit">
                  {slide.active ? "DESATIVAR" : "ATIVAR"}
                </button>
              </form>
              <ActionButtons action={mutateHero} id={slide.id} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
