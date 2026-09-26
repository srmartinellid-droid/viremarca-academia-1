"use client";

import { ImageField } from "@/components/admin/ImageField";
import type { PublicImageChoice } from "@/lib/media/public-images";
import { mutateModality } from "./actions";

export function ModalityForm({ modality, choices }: { modality?: Record<string, unknown>; choices: PublicImageChoice[] }) {
  return (
    <form className="admin-form admin-crud-form" action={mutateModality}>
      {modality?.id ? <input type="hidden" name="id" value={String(modality.id)} /> : null}
      <input type="hidden" name="intent" value="save" />
      <label>Nome<input name="name" required defaultValue={String(modality?.name || "")} /></label>
      <label>Slug<input name="slug" defaultValue={String(modality?.slug || "")} placeholder="automático pelo nome" /></label>
      <label>Resumo<input name="summary" defaultValue={String(modality?.summary || "")} /></label>
      <label>Descrição HTML<textarea name="description" defaultValue={String(modality?.description || "")} /></label>
      <label>Nível<select name="level" defaultValue={String(modality?.level || "todos")}><option value="todos">Todos</option><option value="iniciante">Iniciante</option><option value="intermediario">Intermediário</option><option value="avancado">Avançado</option></select></label>
      <label>Duração<input name="durationMin" type="number" min="1" defaultValue={Number(modality?.durationMin || 60)} /></label>
      <ImageField name="imageUrl" altName="imageAlt" label="Imagem da modalidade" purpose="modality" value={String(modality?.imageUrl || "")} altValue={String(modality?.imageAlt || "")} choices={choices} required />
      <label>Ordem<input name="sortOrder" type="number" min="0" defaultValue={Number(modality?.sortOrder || 0)} /></label>
      <label className="check"><input name="active" type="checkbox" defaultChecked={modality?.active !== false} />Ativo</label>
      <button className="btn">SALVAR MODALIDADE</button>
    </form>
  );
}
