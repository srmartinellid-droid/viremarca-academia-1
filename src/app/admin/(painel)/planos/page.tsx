import { asc } from "drizzle-orm";

import { ActionButtons } from "@/components/admin/ActionButtons";
import { db } from "@/db";
import { plans } from "@/db/schema";
import { requireStaff } from "@/core/auth/guards";
import { mutatePlan } from "./actions";
import { PlanForm } from "./Form";
import { AdminModal } from "@/components/admin/AdminModal";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function PlanosPage() {
  await requireStaff();
  const rows = await db.select().from(plans).orderBy(asc(plans.sortOrder));
  return (
    <section className="admin-resource-page">
      <div className="admin-heading"><div><span>CONTEÚDO</span><h1>Planos</h1>
        <p className="admin-page-hint">Gerencia os planos e preços apresentados na página de planos e nos pontos de conversão.</p></div><AdminModal eyebrow="CADASTRO" title="Novo plano" triggerLabel="+ NOVO PLANO"><PlanForm /></AdminModal></div>
      {rows.map((row) => (
        <article className="admin-panel" key={row.id}>
          <div className="admin-row admin-row-head"><strong>{row.name}</strong><span>R$ {(row.priceCents / 100).toFixed(2)}</span><span>{row.highlighted ? "Destaque" : row.period}</span></div>
          <AdminModal title="Editar plano" triggerLabel="Editar plano" footer={<form action={mutatePlan}><input type="hidden" name="intent" value="delete" /><input type="hidden" name="id" value={row.id} /><DeleteButton /></form>}><PlanForm plan={row as unknown as Record<string, unknown>} /></AdminModal>
          <div className="admin-list-footer"><ActionButtons action={mutatePlan} id={row.id} canDelete={false} /></div>
        </article>
      ))}
    </section>
  );
}
