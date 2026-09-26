import { asc } from "drizzle-orm";

import { ActionButtons } from "@/components/admin/ActionButtons";
import { getImageChoices } from "@/lib/media/public-images";
import { requireStaff } from "@/core/auth/guards";
import { db } from "@/db";
import { heroSlides } from "@/db/schema";
import { mutateHero } from "./actions";
import { HeroForm } from "./Form";

export default async function HeroPage() {
  await requireStaff();
  const [hero, choices] = await Promise.all([
    db.select().from(heroSlides).orderBy(asc(heroSlides.sortOrder)),
    getImageChoices(),
  ]);

  return (
    <section>
      <div className="admin-heading">
        <div>
          <span>CONTEÚDO</span>
          <h1>Hero</h1>
        <p className="admin-page-hint">Controla os slides da capa da home. Só slides ativos aparecem no site.</p>
        </div>
        <HeroForm choices={choices} />
      </div>
      <p className="admin-storage-note">
        Upload direto disponível após configurar o armazenamento.
      </p>
      <div className="admin-list">
        {hero.map((slide) => (
          <article
            className={"admin-panel hero-admin-card" + (slide.active ? "" : " is-inactive")}
            key={slide.id}
          >
            <details open={slide.active}>
              <summary className="admin-row admin-row-head">
                <strong>{slide.title}</strong>
                <span>{slide.active ? "Ativo" : "Inativo"}</span>
                <span>#{slide.sortOrder}</span>
              </summary>
              <HeroForm
                slide={slide as unknown as Record<string, unknown>}
                choices={choices}
              />
            </details>
            <div className="admin-list-footer">
              <form action={mutateHero}>
                <input type="hidden" name="intent" value="toggle" />
                <input type="hidden" name="id" value={slide.id} />
                <button className="btn small" type="submit">
                  {slide.active ? "DESATIVAR" : "ATIVAR"}
                </button>
              </form>
              <form action={mutateHero}>
                <input type="hidden" name="intent" value="duplicate" />
                <input type="hidden" name="id" value={slide.id} />
                <button className="admin-icon-button" type="submit">Duplicar</button>
              </form>
              <ActionButtons action={mutateHero} id={slide.id} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
