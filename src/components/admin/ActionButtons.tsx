"use client";

import type { FormEvent } from "react";

export function ActionButtons({
  action,
  id,
  canDelete = true,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  canDelete?: boolean;
}) {
  const confirmDelete = (event: FormEvent<HTMLFormElement>) => {
    if (!window.confirm("Excluir este registro? Esta ação não pode ser desfeita.")) {
      event.preventDefault();
    }
  };
  return (
    <div className="admin-inline-actions">
      <form action={action}><input type="hidden" name="intent" value="up" /><input type="hidden" name="id" value={id} /><button className="admin-icon-button" aria-label="Subir">↑</button></form>
      <form action={action}><input type="hidden" name="intent" value="down" /><input type="hidden" name="id" value={id} /><button className="admin-icon-button" aria-label="Descer">↓</button></form>
      <form action={action} onSubmit={confirmDelete}>
        <input type="hidden" name="intent" value="delete" />
        <input type="hidden" name="id" value={id} />
        {canDelete ? <button className="admin-danger-button" type="submit">Excluir</button> : null}
      </form>
    </div>
  );
}
