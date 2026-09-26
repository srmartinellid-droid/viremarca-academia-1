"use client";

import { mutateSection } from "./actions";

export function SectionForm({ section }: { section: Record<string, unknown> }) {
  return (
    <form className="admin-inline-form" action={mutateSection}>
      <input type="hidden" name="key" value={String(section.key)} />
      <label className="check"><input name="active" type="checkbox" defaultChecked={section.active === true} />Ativa</label>
      <input name="sortOrder" type="number" min="0" defaultValue={Number(section.sortOrder || 0)} aria-label="Ordem" />
      <button className="btn small">SALVAR</button>
    </form>
  );
}
