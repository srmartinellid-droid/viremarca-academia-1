import { asc } from "drizzle-orm";

import { ActionButtons } from "@/components/admin/ActionButtons";
import { db } from "@/db";
import { plans } from "@/db/schema";
import { requireStaff } from "@/core/auth/guards";
import { mutatePlan } from "./actions";
import { PlanForm } from "./Form";

export default async function PlanosPage() {
  await requireStaff();
  const rows = await db.select().from(plans).orderBy(asc(plans.sortOrder));
  return (
    <section>
      <div className="admin-heading"><div><span>CONTEÚDO</span><h1>Planos</h1>
        <p className="admin-page-hint">Gerencia os planos e preços apresentados na página de planos e nos pontos de conversão.</p></div><PlanForm /></div>
      {rows.map((row) => (
        <article className="admin-panel" key={row.id}>
          <div className="admin-row admin-row-head"><strong>{row.name}</strong><span>R$ {(row.priceCents / 100).toFixed(2)}</span><span>{row.highlighted ? "Destaque" : row.period}</span></div>
          <PlanForm plan={row as unknown as Record<string, unknown>} />
          <div className="admin-list-footer"><ActionButtons action={mutatePlan} id={row.id} /></div>
        </article>
      ))}
    </section>
  );
}
