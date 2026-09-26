"use client";

import { mutatePlan } from "./actions";

export function PlanForm({ plan }: { plan?: Record<string, unknown> }) {
  const benefits = Array.isArray(plan?.benefits) ? (plan?.benefits as string[]).join("\n") : "";
  return (
    <form className="admin-form admin-crud-form" action={mutatePlan}>
      {plan?.id ? <input type="hidden" name="id" value={String(plan.id)} /> : null}
      <input type="hidden" name="intent" value="save" />
      <label>Nome<input name="name" required defaultValue={String(plan?.name || "")} /></label>
      <label>Período<select name="period" defaultValue={String(plan?.period || "mensal")}><option value="mensal">Mensal</option><option value="trimestral">Trimestral</option><option value="semestral">Semestral</option><option value="anual">Anual</option><option value="avulso">Diária / avulso</option></select></label>
      <label>Preço em reais<input name="price" type="number" step="0.01" min="0" defaultValue={plan?.priceCents ? Number(plan.priceCents) / 100 : 0} /></label>
      <label>Benefícios, um por linha<textarea name="benefits" defaultValue={benefits} /></label>
      <label>Badge<input name="badge" defaultValue={String(plan?.badge || "")} /></label>
      <label>CTA<input name="ctaLabel" defaultValue={String(plan?.ctaLabel || "")} /></label>
      <label>Ordem<input name="sortOrder" type="number" min="0" defaultValue={Number(plan?.sortOrder || 0)} /></label>
      <label className="check"><input name="highlighted" type="checkbox" defaultChecked={Boolean(plan?.highlighted)} />Destaque</label>
      <label className="check"><input name="active" type="checkbox" defaultChecked={plan?.active !== false} />Ativo</label>
      <button className="btn">SALVAR PLANO</button>
    </form>
  );
}
