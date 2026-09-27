import { asc } from "drizzle-orm";

import { ActionButtons } from "@/components/admin/ActionButtons";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { requireStaff } from "@/core/auth/guards";
import { mutateTestimonial } from "./actions";
import { TestimonialForm } from "./Form";
import { AdminModal } from "@/components/admin/AdminModal";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function DepoimentosPage() {
  await requireStaff();
  const rows = await db.select().from(testimonials).orderBy(asc(testimonials.sortOrder));
  return (
    <section className="admin-resource-page">
      <div className="admin-heading"><div><span>CONTEÚDO</span><h1>Depoimentos</h1>
        <p className="admin-page-hint">Gerencia os depoimentos exibidos nas áreas de prova social do site.</p></div><AdminModal eyebrow="CADASTRO" title="Novo depoimento" triggerLabel="+ NOVO DEPOIMENTO"><TestimonialForm /></AdminModal></div>
      {rows.map((row) => (
        <article className="admin-panel" key={row.id}>
          <div className="admin-row admin-row-head"><strong>{row.authorName}</strong><span>{row.isDemo ? "Demo" : "Real"}</span><span>{row.active ? "Ativo" : "Inativo"}</span></div>
          <AdminModal title="Editar depoimento" triggerLabel="Editar depoimento" footer={<form action={mutateTestimonial}><input type="hidden" name="intent" value="delete" /><input type="hidden" name="id" value={row.id} /><DeleteButton /></form>}><TestimonialForm item={row as unknown as Record<string, unknown>} /></AdminModal>
          <div className="admin-list-footer"><ActionButtons action={mutateTestimonial} id={row.id} canDelete={false} /></div>
        </article>
      ))}
    </section>
  );
}
