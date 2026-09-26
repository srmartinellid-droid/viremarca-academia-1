import { asc } from "drizzle-orm";

import { ActionButtons } from "@/components/admin/ActionButtons";
import { requireStaff } from "@/core/auth/guards";
import { db } from "@/db";
import { galleryItems } from "@/db/schema";
import { getImageChoices } from "@/lib/media/public-images";
import { mutateGallery } from "./actions";
import { GalleryForm } from "./Form";

export default async function GaleriaPage() {
  await requireStaff();
  const [rows, choices] = await Promise.all([
    db.select().from(galleryItems).orderBy(asc(galleryItems.sortOrder)),
    getImageChoices(),
  ]);

  return (
    <section>
      <div className="admin-heading">
        <div><span>CONTEÚDO</span><h1>Estrutura</h1>
        <p className="admin-page-hint">Gerencia as imagens da estrutura exibidas no site.</p></div>
        <GalleryForm choices={choices} />
      </div>
      {rows.map((row) => (
        <article className="admin-panel" key={row.id}>
          <div className="admin-row admin-row-head">
            <strong>{row.area}</strong>
            <span>{row.isIllustration ? "Ilustrativa" : "Foto"}</span>
            <span>{row.active ? "Ativa" : "Inativa"}</span>
          </div>
          <GalleryForm item={row as unknown as Record<string, unknown>} choices={choices} />
          <div className="admin-list-footer">
            <form action={mutateGallery}>
              <input type="hidden" name="intent" value="toggle" />
              <input type="hidden" name="id" value={row.id} />
              <button className="btn small" type="submit">{row.active ? "DESATIVAR" : "ATIVAR"}</button>
            </form>
            <ActionButtons action={mutateGallery} id={row.id} />
          </div>
        </article>
      ))}
    </section>
  );
}
