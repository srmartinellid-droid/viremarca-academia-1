"use client";

import Image from "next/image";
import { useState, useTransition } from "react";

import { deleteMedia, updateMediaAlt, uploadImage } from "@/core/media/actions";

type Item = {
  id: string;
  url: string;
  pathname: string;
  alt: string;
  width: number | null;
  height: number | null;
  sizeBytes: number;
  usedIn: string[];
  source: "upload";
};
type MockItem = { url: string; label: string; usedIn: string[]; source: "mock" };

export function MediaLibrary({ items, mockItems = [] }: { items: Item[]; mockItems?: MockItem[] }) {
  const [alt, setAlt] = useState<Record<string, string>>(
    Object.fromEntries(items.map((item) => [item.id, item.alt])),
  );
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  const upload = (files: FileList | null) => {
    if (!files?.length) return;
    startTransition(async () => {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.set("file", file);
        formData.set("purpose", "gallery");
        formData.set("alt", file.name.replace(/\.[^.]+$/, ""));
        const result = await uploadImage(formData);
        if (!result.ok) setMessage(result.message);
      }
      window.location.reload();
    });
  };

  return (
    <div className="media-library">
      <div className="media-library-toolbar">
        <label className="admin-upload-button">
          {pending ? "Enviando…" : "Adicionar imagens"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={pending}
            onChange={(event) => upload(event.target.files)}
          />
        </label>
        <span className="admin-image-hint">Imagens enviadas podem ser editadas e excluídas. Imagens demo do template são somente leitura.</span>
        {message ? <span className="form-error">{message}</span> : null}
      </div>
      <div className="media-library-grid">
        {mockItems.map((item) => (
          <article className="media-library-card" key={item.url}>
            <Image src={item.url} alt="" width={400} height={260} sizes="(max-width: 800px) 100vw, 33vw" />
            <strong>{item.label}</strong><small>Imagem demo do template</small>
            <small>{item.usedIn.length ? "Em uso: " + item.usedIn.join(" · ") : "Disponível para seleção"}</small>
          </article>
        ))}
        {items.map((item) => (
          <article className="media-library-card" key={item.id}>
            <Image src={item.url} alt={item.alt} width={400} height={260} sizes="(max-width: 800px) 100vw, 33vw" />
            <strong>{item.pathname}</strong>
            {item.usedIn.length ? <small>Em uso: {item.usedIn.join(" · ")}</small> : <small>Sem uso cadastrado</small>}
            <input
              value={alt[item.id] || ""}
              onChange={(event) => setAlt((value) => ({ ...value, [item.id]: event.target.value }))}
              aria-label={"Texto alternativo de " + item.pathname}
            />
            <div className="admin-inline-actions">
              <button className="admin-icon-button" type="button" onClick={() => startTransition(async () => { await updateMediaAlt(item.id, alt[item.id] || ""); })}>Salvar descrição</button>
              <button className="admin-danger-button" type="button" onClick={() => { if (!window.confirm("Excluir esta imagem?")) return; startTransition(async () => { try { await deleteMedia(item.id); window.location.reload(); } catch (error) { setMessage(error instanceof Error ? error.message : "Não foi possível excluir."); } }); }}>Excluir</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
