"use client";

import { ImageField } from "@/components/admin/ImageField";
import type { PublicImageChoice } from "@/lib/media/public-images";
import { mutateInstructor } from "./actions";

export function InstructorForm({ item, choices }: { item?: Record<string, unknown>; choices: PublicImageChoice[] }) {
  return (
    <form className="admin-form admin-crud-form" action={mutateInstructor}>
      {item?.id ? <input type="hidden" name="id" value={String(item.id)} /> : null}
      <input type="hidden" name="intent" value="save" />
      <label>Nome<input name="name" required defaultValue={String(item?.name || "")} /></label>
      <label>Função<input name="role" defaultValue={String(item?.role || "")} /></label>
      <label>Especialidades<input name="specialties" defaultValue={String(item?.specialties || "")} /></label>
      <label>Bio<textarea name="bio" defaultValue={String(item?.bio || "")} /></label>
      <ImageField name="photoUrl" altName="photoAlt" label="Foto do professor" purpose="team" value={String(item?.photoUrl || "")} altValue={String(item?.photoAlt || "")} choices={choices} required />
      <label>Registro profissional<input name="professionalRegistry" defaultValue={String(item?.professionalRegistry || "")} /></label>
      <label>Ordem<input name="sortOrder" type="number" min="0" defaultValue={Number(item?.sortOrder || 0)} /></label>
      <label className="check"><input name="active" type="checkbox" defaultChecked={item?.active !== false} />Ativo</label>
      <button className="btn">SALVAR PROFESSOR</button>
    </form>
  );
}
