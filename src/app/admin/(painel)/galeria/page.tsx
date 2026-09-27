import { asc } from "drizzle-orm";

import { ActionButtons } from "@/components/admin/ActionButtons";
import { requireStaff } from "@/core/auth/guards";
import { db } from "@/db";
import { galleryItems } from "@/db/schema";
import { getImageChoices } from "@/lib/media/public-images";
import { mutateGallery } from "./actions";
import { GalleryForm } from "./Form";
import { AdminModal } from "@/components/admin/AdminModal";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function GaleriaPage() {
  await requireStaff();
  const [rows, choices] = await Promise.all([
    db.select().from(galleryItems).orderBy(asc(galleryItems.sortOrder)),
    getImageChoices(),
  ]);

  return (
    <section className="admin-resource-page">
      <div className="admin-heading">
        <div><span>CONTEÚDO</span><h1>Estrutura</h1>
        <p className="admin-page-hint">Gerencia as imagens da estrutura exibidas no site.</p></div>
        <AdminModal eyebrow="CADASTRO" title="Nova imagem de estrutura" triggerLabel="+ NOVA IMAGEM"><GalleryForm choices={choices} /></AdminModal>
      </div>
      {rows.map((row) => (
        <article className="admin-panel" key={row.id}>
          <div className="admin-row admin-row-head">
            <strong>{row.area}</strong>
            <span>{row.isIllustration ? "Ilustrativa" : "Foto"}</span>
            <span>{row.active ? "Ativa" : "Inativa"}</span>
          </div>
          <AdminModal title="Editar imagem" triggerLabel="Editar imagem" footer={<form action={mutateGallery}><input type="hidden" name="intent" value="delete" /><input type="hidden" name="id" value={row.id} /><DeleteButton /></form>}><GalleryForm item={row as unknown as Record<string, unknown>} choices={choices} /></AdminModal>
          <div className="admin-list-footer">
            <form action={mutateGallery}>
              <input type="hidden" name="intent" value="toggle" />
              <input type="hidden" name="id" value={row.id} />
              <button className="btn small" type="submit">{row.active ? "DESATIVAR" : "ATIVAR"}</button>
            </form>
            <ActionButtons action={mutateGallery} id={row.id} canDelete={false} />
          </div>
        </article>
      ))}
    </section>
  );
}
