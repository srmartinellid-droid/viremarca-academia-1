"use client";

import { ImageField } from "@/components/admin/ImageField";
import type { PublicImageChoice } from "@/lib/media/public-images";
import { mutatePost } from "./actions";

export function PostForm({ post, categories, choices }: { post?: Record<string, unknown>; categories: Array<Record<string, unknown>>; choices: PublicImageChoice[] }) {
  const published = post?.publishedAt ? new Date(String(post.publishedAt)).toISOString().slice(0, 16) : "";
  return (
    <form className="admin-form admin-crud-form" action={mutatePost}>
      {post?.id ? <input type="hidden" name="id" value={String(post.id)} /> : null}
      <input type="hidden" name="intent" value="save" />
      <label>Título<input name="title" required defaultValue={String(post?.title || "")} /></label>
      <label>Slug<input name="slug" required defaultValue={String(post?.slug || "")} /></label>
      <label>Resumo<textarea name="excerpt" defaultValue={String(post?.excerpt || "")} /></label>
      <ImageField name="coverUrl" altName="coverAlt" label="Capa" purpose="cover" value={String(post?.coverUrl || "")} altValue={String(post?.coverAlt || "")} choices={choices} required />
      <label>Categoria<select name="categoryId" defaultValue={String(post?.categoryId || "")}><option value="">Sem categoria</option>{categories.map((category) => <option value={String(category.id)} key={String(category.id)}>{String(category.name)}</option>)}</select></label>
      <label>Status<select name="status" defaultValue={String(post?.status || "draft")}><option value="draft">Rascunho</option><option value="scheduled">Agendado</option><option value="published">Publicado</option></select></label>
      <label>Data de publicação<input name="publishedAt" type="datetime-local" defaultValue={published} /></label>
      <label>Conteúdo HTML<textarea name="contentHtml" defaultValue={String(post?.contentHtml || "")} /></label>
      <button className="btn">SALVAR PUBLICAÇÃO</button>
    </form>
  );
}
