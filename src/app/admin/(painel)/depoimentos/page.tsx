import { asc } from "drizzle-orm";

import { ActionButtons } from "@/components/admin/ActionButtons";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { requireStaff } from "@/core/auth/guards";
import { mutateTestimonial } from "./actions";
import { TestimonialForm } from "./Form";

export default async function DepoimentosPage() {
  await requireStaff();
  const rows = await db.select().from(testimonials).orderBy(asc(testimonials.sortOrder));
  return (
    <section>
      <div className="admin-heading"><div><span>CONTEÚDO</span><h1>Depoimentos</h1>
        <p className="admin-page-hint">Gerencia os depoimentos exibidos nas áreas de prova social do site.</p></div><TestimonialForm /></div>
      {rows.map((row) => (
        <article className="admin-panel" key={row.id}>
          <div className="admin-row admin-row-head"><strong>{row.authorName}</strong><span>{row.isDemo ? "Demo" : "Real"}</span><span>{row.active ? "Ativo" : "Inativo"}</span></div>
          <TestimonialForm item={row as unknown as Record<string, unknown>} />
          <div className="admin-list-footer"><ActionButtons action={mutateTestimonial} id={row.id} /></div>
        </article>
      ))}
    </section>
  );
}
