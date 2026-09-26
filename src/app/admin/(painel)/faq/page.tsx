import { asc } from "drizzle-orm";

import { ActionButtons } from "@/components/admin/ActionButtons";
import { db } from "@/db";
import { faqs } from "@/db/schema";
import { requireStaff } from "@/core/auth/guards";
import { mutateFaq } from "./actions";
import { FaqForm } from "./Form";

export default async function FaqPage() {
  await requireStaff();
  const rows = await db.select().from(faqs).orderBy(asc(faqs.sortOrder));
  return (
    <section>
      <div className="admin-heading"><div><span>CONTEÚDO</span><h1>FAQ</h1>
        <p className="admin-page-hint">Gerencia perguntas e respostas exibidas na seção de dúvidas e no conteúdo de SEO.</p></div><FaqForm /></div>
      {rows.map((row) => (
        <article className="admin-panel" key={row.id}>
          <div className="admin-row admin-row-head"><strong>{row.question}</strong><span>{row.active ? "Ativa" : "Inativa"}</span></div>
          <FaqForm item={row as unknown as Record<string, unknown>} />
          <div className="admin-list-footer"><ActionButtons action={mutateFaq} id={row.id} /></div>
        </article>
      ))}
    </section>
  );
}
