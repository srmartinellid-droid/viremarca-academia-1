"use client";

import { mutateFaq } from "./actions";

export function FaqForm({ item }: { item?: Record<string, unknown> }) {
  return (
    <form className="admin-form admin-crud-form" action={mutateFaq}>
      {item?.id ? <input type="hidden" name="id" value={String(item.id)} /> : null}
      <input type="hidden" name="intent" value="save" />
      <label>Pergunta<input name="question" required defaultValue={String(item?.question || "")} /></label>
      <label>Resposta<textarea name="answer" required defaultValue={String(item?.answer || "")} /></label>
      <label>Ordem<input name="sortOrder" type="number" min="0" defaultValue={Number(item?.sortOrder || 0)} /></label>
      <label className="check"><input name="active" type="checkbox" defaultChecked={item?.active !== false} />Ativo</label>
      <button className="btn">SALVAR FAQ</button>
    </form>
  );
}
