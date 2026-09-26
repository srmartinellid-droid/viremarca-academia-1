"use client";

import type { FormEvent } from "react";

export type CrudField = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "checkbox" | "select" | "datetime-local";
  required?: boolean;
  defaultValue?: string | number | boolean | null;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
};

export function CrudForm({
  action,
  fields,
  submitLabel = "SALVAR",
}: {
  action: (formData: FormData) => void | Promise<void>;
  fields: CrudField[];
  submitLabel?: string;
}) {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    if (form.dataset.confirmDelete === "true" && !window.confirm("Excluir este registro?")) {
      event.preventDefault();
    }
  };

  return (
    <form action={action} onSubmit={onSubmit} className="admin-form admin-crud-form">
      {fields.map((field) => {
        if (field.type === "checkbox") {
          return (
            <label className="check" key={field.name}>
              <input
                name={field.name}
                type="checkbox"
                defaultChecked={Boolean(field.defaultValue)}
              />
              {field.label}
            </label>
          );
        }
        if (field.type === "select") {
          return (
            <label key={field.name}>
              {field.label}
              <select
                name={field.name}
                defaultValue={String(field.defaultValue ?? "")}
                required={field.required}
              >
                {field.options?.map((option) => (
                  <option value={option.value} key={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          );
        }
        return (
          <label key={field.name}>
            {field.label}
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                defaultValue={String(field.defaultValue ?? "")}
                placeholder={field.placeholder}
                required={field.required}
              />
            ) : (
              <input
                name={field.name}
                type={field.type || "text"}
                defaultValue={String(field.defaultValue ?? "")}
                placeholder={field.placeholder}
                required={field.required}
              />
            )}
          </label>
        );
      })}
      <button className="btn" type="submit">{submitLabel}</button>
    </form>
  );
}
