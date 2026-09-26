"use client";

import { useState } from "react";
import { mutateHero } from "./actions";

export function HeroForm({ slide }: { slide?: Record<string, unknown> }) {
  const [open, setOpen] = useState(Boolean(slide));
  if (!open) return <button className="btn" type="button" onClick={() => setOpen(true)}>NOVO SLIDE</button>;
  return (
    <form className="admin-form admin-crud-form" action={mutateHero}>
      {slide?.id ? <input type="hidden" name="id" value={String(slide.id)} /> : null}
      <input type="hidden" name="intent" value="save" />
      <label>Título<input name="title" required defaultValue={String(slide?.title || "")} /></label>
      <label>Subtítulo<textarea name="subtitle" defaultValue={String(slide?.subtitle || "")} /></label>
      <label>CTA<input name="ctaLabel" defaultValue={String(slide?.ctaLabel || "")} /></label>
      <label>URL CTA<input name="ctaHref" defaultValue={String(slide?.ctaHref || "")} /></label>
      <label>Imagem desktop URL<input name="imageDesktopUrl" defaultValue={String(slide?.imageDesktopUrl || "")} /></label>
      <label>Imagem mobile URL<input name="imageMobileUrl" defaultValue={String(slide?.imageMobileUrl || "")} /></label>
      <label>Alt da imagem<input name="imageAlt" required defaultValue={String(slide?.imageAlt || "")} /></label>
      <label>Ordem<input name="sortOrder" type="number" min="0" defaultValue={Number(slide?.sortOrder || 0)} /></label>
      <label className="check"><input name="active" type="checkbox" defaultChecked={slide?.active !== false} />Ativo</label>
      <button className="btn">SALVAR SLIDE</button>
    </form>
  );
}
