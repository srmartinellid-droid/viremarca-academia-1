"use client";

import { useState } from "react";

import { ImageField } from "@/components/admin/ImageField";
import type { PublicImageChoice } from "@/lib/media/public-images";
import { mutateHero } from "./actions";

export function HeroForm({ slide, choices }: { slide?: Record<string, unknown>; choices: PublicImageChoice[] }) {
  const [open, setOpen] = useState(Boolean(slide));
  if (!open) return <button className="btn" type="button" onClick={() => setOpen(true)}>+ NOVO SLIDE</button>;
  return (
    <form className="admin-form admin-crud-form" action={mutateHero}>
      {slide?.id ? <input type="hidden" name="id" value={String(slide.id)} /> : null}
      <input type="hidden" name="intent" value="save" />
      <div className="hero-admin-previews">
        <div><span>Desktop</span><div className="hero-admin-preview hero-admin-preview-wide">{slide?.imageDesktopUrl ? <img src={String(slide.imageDesktopUrl)} alt="" /> : <span>Sem imagem</span>}</div></div>
        <div><span>Mobile</span><div className="hero-admin-preview">{slide?.imageMobileUrl ? <img src={String(slide.imageMobileUrl)} alt="" /> : <span>Sem imagem</span>}</div></div>
      </div>
      <label>Título<input name="title" required defaultValue={String(slide?.title || "")} /></label>
      <label>Subtítulo<textarea name="subtitle" defaultValue={String(slide?.subtitle || "")} /></label>
      <label>CTA<input name="ctaLabel" defaultValue={String(slide?.ctaLabel || "")} /></label>
      <label>URL CTA<input name="ctaHref" defaultValue={String(slide?.ctaHref || "")} /></label>
      <ImageField name="imageDesktopUrl" altName="imageAlt" label="Imagem desktop" purpose="hero-desktop" value={String(slide?.imageDesktopUrl || "")} altValue={String(slide?.imageAlt || "")} choices={choices} required />
      <ImageField name="imageMobileUrl" altName="imageAlt" label="Imagem mobile" purpose="hero-mobile" value={String(slide?.imageMobileUrl || "")} altValue={String(slide?.imageAlt || "")} choices={choices} required />
      <label>Ordem<input name="sortOrder" type="number" min="0" defaultValue={Number(slide?.sortOrder || 0)} /></label>
      <label className="check"><input name="active" type="checkbox" defaultChecked={slide?.active !== false} />Ativo</label>
      <button className="btn">SALVAR SLIDE</button>
    </form>
  );
}
