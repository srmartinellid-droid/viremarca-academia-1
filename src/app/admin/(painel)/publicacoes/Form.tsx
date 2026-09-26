"use client";

import { mutatePost } from "./actions";

export function PostForm({ post, categories }: { post?: Record<string, unknown>; categories: Array<Record<string, unknown>> }) {
  const published = post?.publishedAt ? new Date(String(post.publishedAt)).toISOString().slice(0, 16) : "";
  return (
    <form className="admin-form admin-crud-form" action={mutatePost}>
      {post?.id ? <input type="hidden" name="id" value={String(post.id)} /> : null}
      <input type="hidden" name="intent" value="save" />
      <label>Título<input name="title" required defaultValue={String(post?.title || "")} /></label>
      <label>Slug<input name="slug" required defaultValue={String(post?.slug || "")} /></label>
      <label>Resumo<textarea name="excerpt" defaultValue={String(post?.excerpt || "")} /></label>
      <label>Capa URL<input name="coverUrl" defaultValue={String(post?.coverUrl || "")} /></label>
      <label>Categoria<select name="categoryId" defaultValue={String(post?.categoryId || "")}><option value="">Sem categoria</option>{categories.map((c) => <option value={String(c.id)} key={String(c.id)}>{String(c.name)}</option>)}</select></label>
      <label>Status<select name="status" defaultValue={String(post?.status || "draft")}><option value="draft">Rascunho</option><option value="scheduled">Agendado</option><option value="published">Publicado</option></select></label>
      <label>Data de publicação<input name="publishedAt" type="datetime-local" defaultValue={published} /></label>
      <label>Conteúdo HTML<textarea name="contentHtml" defaultValue={String(post?.contentHtml || "")} /></label>
      <button className="btn">SALVAR PUBLICAÇÃO</button>
    </form>
  );
}
