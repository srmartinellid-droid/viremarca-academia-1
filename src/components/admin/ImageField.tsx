"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";

import { uploadImage } from "@/core/media/actions";
import type { PublicImageChoice } from "@/lib/media/public-images";

export type ImagePurpose =
  | "hero-desktop"
  | "hero-mobile"
  | "modality"
  | "team"
  | "gallery"
  | "cover"
  | "logo";

type Props = {
  name: string;
  altName: string;
  label: string;
  value?: string | null;
  altValue?: string | null;
  purpose: ImagePurpose;
  choices?: PublicImageChoice[];
  required?: boolean;
};

export function ImageField({
  name,
  altName,
  label,
  value = "",
  altValue = "",
  purpose,
  choices = [],
  required = false,
}: Props) {
  const [url, setUrl] = useState(value || "");
  const [alt, setAlt] = useState(altValue || "");
  const [preview, setPreview] = useState(value || "");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);

  const select = (next: string) => {
    setUrl(next);
    setPreview(next);
  };

  const onFile = (file: File) => {
    setError("");
    const formData = new FormData();
    formData.set("file", file);
    formData.set("purpose", purpose);
    formData.set("alt", alt);

    const form = fieldsetRef.current?.closest("form");
    const buttons = form
      ? Array.from(form.querySelectorAll<HTMLButtonElement>('button[type="submit"]'))
      : [];

    buttons.forEach((button) => {
      button.disabled = true;
    });

    startTransition(async () => {
      try {
        const result = await uploadImage(formData);
        if (!result.ok) {
          setError(result.message);
          return;
        }
        select(result.url);
        setAlt(result.alt);
      } finally {
        buttons.forEach((button) => {
          button.disabled = false;
        });
      }
    });
  };

  return (
    <fieldset ref={fieldsetRef} className="admin-image-field">
      <legend>{label}</legend>
      <input type="hidden" name={name} value={url} />
      <label>
        Alt obrigatório
        <input
          name={altName}
          value={alt}
          required={required || Boolean(url)}
          onChange={(event) => setAlt(event.target.value)}
        />
      </label>
      <div className="admin-image-preview" aria-live="polite">
        {preview ? <img src={preview} alt="Pré-visualização" /> : <span>Sem imagem</span>}
      </div>
      <div className="admin-image-actions">
        <label className="admin-upload-button">
          {pending ? "Enviando…" : "Enviar do dispositivo"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={pending}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onFile(file);
              event.currentTarget.value = "";
            }}
          />
        </label>
        <button
          type="button"
          className="admin-icon-button"
          onClick={() => select("")}
          disabled={pending}
        >
          Remover imagem
        </button>
      </div>
      {choices.length ? (
        <details className="admin-image-library">
          <summary>Escolher da biblioteca</summary>
          <div className="admin-image-grid">
            {choices.map((choice) => (
              <button
                type="button"
                key={choice.url}
                onClick={() => select(choice.url)}
                title={choice.label}
              >
                <Image src={choice.url} alt="" width={160} height={100} sizes="160px" />
                <span>{choice.label}</span>
              </button>
            ))}
          </div>
        </details>
      ) : null}
      <details>
        <summary>Colar URL (avançado)</summary>
        <input
          value={url}
          onChange={(event) => select(event.target.value)}
          placeholder="https://..."
          inputMode="url"
        />
      </details>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <p className="admin-image-hint">
        Upload direto disponível após configurar o armazenamento.
      </p>
    </fieldset>
  );
}
