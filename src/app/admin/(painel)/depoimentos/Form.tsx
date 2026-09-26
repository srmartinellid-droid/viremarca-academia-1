"use client";

import { mutateTestimonial } from "./actions";

export function TestimonialForm({ item }: { item?: Record<string, unknown> }) {
  return (
    <form className="admin-form admin-crud-form" action={mutateTestimonial}>
      {item?.id ? <input type="hidden" name="id" value={String(item.id)} /> : null}
      <input type="hidden" name="intent" value="save" />
      <label>Nome<input name="authorName" required defaultValue={String(item?.authorName || "")} /></label>
      <label>Informação<input name="authorInfo" defaultValue={String(item?.authorInfo || "")} /></label>
      <label>Depoimento<textarea name="quote" required defaultValue={String(item?.quote || "")} /></label>
      <label>Nota<input name="rating" type="number" min="1" max="5" defaultValue={Number(item?.rating || 5)} /></label>
      <label>Ordem<input name="sortOrder" type="number" min="0" defaultValue={Number(item?.sortOrder || 0)} /></label>
      <label className="check"><input name="isDemo" type="checkbox" defaultChecked={item?.isDemo === true} />Demo</label>
      <label className="check"><input name="active" type="checkbox" defaultChecked={item?.active !== false} />Ativo</label>
      <button className="btn">SALVAR DEPOIMENTO</button>
    </form>
  );
}
