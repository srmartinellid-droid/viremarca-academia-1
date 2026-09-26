"use client";

export function DeleteButton() {
  return (
    <button
      className="admin-danger-button"
      type="submit"
      onClick={(event) => {
        if (!window.confirm("Excluir este registro? Esta ação não pode ser desfeita.")) {
          event.preventDefault();
        }
      }}
    >
      Excluir
    </button>
  );
}
