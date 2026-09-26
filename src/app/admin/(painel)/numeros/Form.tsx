"use client";

import { mutateStat } from "./actions";

export function StatForm({ item }: { item?: Record<string, unknown> }) {
  return (
    <form className="admin-form admin-crud-form" action={mutateStat}>
      {item?.id ? <input type="hidden" name="id" value={String(item.id)} /> : null}
      <input type="hidden" name="intent" value="save" />
      <label>Valor<input name="value" required defaultValue={String(item?.value || "")} /></label>
      <label>Sufixo<input name="suffix" defaultValue={String(item?.suffix || "")} /></label>
      <label>Rótulo<input name="label" required defaultValue={String(item?.label || "")} /></label>
      <label>Ordem<input name="sortOrder" type="number" min="0" defaultValue={Number(item?.sortOrder || 0)} /></label>
      <label className="check"><input name="active" type="checkbox" defaultChecked={item?.active !== false} />Ativo</label>
      <button className="btn">SALVAR NÚMERO</button>
    </form>
  );
}
