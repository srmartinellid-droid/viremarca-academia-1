import { asc } from "drizzle-orm";
import { db } from "@/db";
import { heroSlides } from "@/db/schema";
import { requireStaff } from "@/core/auth/guards";
import { updateHero } from "./actions";

export default async function AdminHero() {
  await requireStaff();
  const slides = await db.select().from(heroSlides).orderBy(asc(heroSlides.sortOrder));
  return (
    <section>
      <div className="admin-heading">
        <span>CONTEÚDO</span>
        <h1>Hero</h1>
      </div>
      {slides.map((slide) => (
        <form className="admin-form" action={updateHero} key={slide.id}>
          <input type="hidden" name="id" value={slide.id} />
          <label>
            Título
            <input name="title" defaultValue={slide.title} />
          </label>
          <label>
            Subtítulo
            <textarea name="subtitle" defaultValue={slide.subtitle || ""} />
          </label>
          <label>
            CTA
            <input name="ctaLabel" defaultValue={slide.ctaLabel || ""} />
          </label>
          <label>
            Destino
            <input name="ctaHref" defaultValue={slide.ctaHref || ""} />
          </label>
          <button className="btn" type="submit">
            SALVAR SLIDE
          </button>
        </form>
      ))}
    </section>
  );
}
