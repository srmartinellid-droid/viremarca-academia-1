import { desc } from "drizzle-orm";

import { DeleteButton } from "@/components/admin/DeleteButton";
import { getImageChoices } from "@/lib/media/public-images";
import { db } from "@/db";
import { postCategories, posts } from "@/db/schema";
import { requireStaff } from "@/core/auth/guards";
import { PostForm } from "./Form";
import { AdminModal } from "@/components/admin/AdminModal";
import { mutatePost } from "./actions";

export default async function PublicacoesPage() {
  await requireStaff();
  const [rows, categories, choices] = await Promise.all([
    db.select().from(posts).orderBy(desc(posts.createdAt)),
    db.select().from(postCategories),
    getImageChoices(),
  ]);
  return (
    <section className="admin-resource-page">
      <div className="admin-heading">
        <div><span>CONTEÚDO</span><h1>Publicações</h1>
        <p className="admin-page-hint">Cria e edita publicações do blog, usadas para conteúdo e SEO do site.</p></div>
        <AdminModal eyebrow="CADASTRO" title="Nova publicação" triggerLabel="+ NOVA PUBLICAÇÃO"><PostForm categories={categories as unknown as Array<Record<string, unknown>>} choices={choices} /></AdminModal>
      </div>
      {rows.map((row) => (
        <article className="admin-panel" key={row.id}>
          <div className="admin-row admin-row-head">
            <strong>{row.title}</strong><span>{row.status}</span><span>{row.slug}</span>
          </div>
          <AdminModal title="Editar publicação" triggerLabel="Editar publicação" footer={<form action={mutatePost}><input type="hidden" name="intent" value="delete" /><input type="hidden" name="id" value={row.id} /><DeleteButton /></form>}><PostForm post={row as unknown as Record<string, unknown>} categories={categories as unknown as Array<Record<string, unknown>>} choices={choices} /></AdminModal>
          <div className="admin-list-footer" />
        </article>
      ))}
    </section>
  );
}
