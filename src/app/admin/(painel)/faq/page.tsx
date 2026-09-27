import { asc } from "drizzle-orm";

import { ActionButtons } from "@/components/admin/ActionButtons";
import { db } from "@/db";
import { faqs } from "@/db/schema";
import { requireStaff } from "@/core/auth/guards";
import { mutateFaq } from "./actions";
import { FaqForm } from "./Form";
import { AdminModal } from "@/components/admin/AdminModal";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function FaqPage() {
  await requireStaff();
  const rows = await db.select().from(faqs).orderBy(asc(faqs.sortOrder));
  return (
    <section className="admin-resource-page">
      <div className="admin-heading"><div><span>CONTEÚDO</span><h1>FAQ</h1>
        <p className="admin-page-hint">Gerencia perguntas e respostas exibidas na seção de dúvidas e no conteúdo de SEO.</p></div><AdminModal eyebrow="CADASTRO" title="Nova pergunta" triggerLabel="+ NOVA PERGUNTA"><FaqForm /></AdminModal></div>
      {rows.map((row) => (
        <article className="admin-panel" key={row.id}>
          <div className="admin-row admin-row-head"><strong>{row.question}</strong><span>{row.active ? "Ativa" : "Inativa"}</span></div>
          <AdminModal title="Editar pergunta" triggerLabel="Editar pergunta" footer={<form action={mutateFaq}><input type="hidden" name="intent" value="delete" /><input type="hidden" name="id" value={row.id} /><DeleteButton /></form>}><FaqForm item={row as unknown as Record<string, unknown>} /></AdminModal>
          <div className="admin-list-footer"><ActionButtons action={mutateFaq} id={row.id} canDelete={false} /></div>
        </article>
      ))}
    </section>
  );
}
