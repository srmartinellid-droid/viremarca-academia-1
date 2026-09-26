"use client";

import { ImageField } from "@/components/admin/ImageField";
import type { PublicImageChoice } from "@/lib/media/public-images";
import { mutateGallery } from "./actions";

export function GalleryForm({ item, choices }: { item?: Record<string, unknown>; choices: PublicImageChoice[] }) {
  return (
    <form className="admin-form admin-crud-form" action={mutateGallery}>
      {item?.id ? <input type="hidden" name="id" value={String(item.id)} /> : null}
      <input type="hidden" name="intent" value="save" />
      <label>Área<input name="area" required defaultValue={String(item?.area || "")} /></label>
      <ImageField name="imageUrl" altName="imageAlt" label="Imagem" purpose="gallery" value={String(item?.imageUrl || "")} altValue={String(item?.imageAlt || "")} choices={choices} required />
      <label>Legenda<textarea name="caption" defaultValue={String(item?.caption || "")} /></label>
      <label className="check"><input name="isIllustration" type="checkbox" defaultChecked={item?.isIllustration === true} />Imagem ilustrativa</label>
      <label>Ordem<input name="sortOrder" type="number" min="0" defaultValue={Number(item?.sortOrder || 0)} /></label>
      <label className="check"><input name="active" type="checkbox" defaultChecked={item?.active !== false} />Ativo</label>
      <button className="btn">SALVAR GALERIA</button>
    </form>
  );
}
