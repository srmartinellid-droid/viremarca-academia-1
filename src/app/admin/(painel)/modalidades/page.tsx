import { asc } from "drizzle-orm";

import { ActionButtons } from "@/components/admin/ActionButtons";
import { getImageChoices } from "@/lib/media/public-images";
import { requireStaff } from "@/core/auth/guards";
import { db } from "@/db";
import { modalities } from "@/db/schema";
import { mutateModality } from "./actions";
import { ModalityForm } from "./Form";

export default async function ModalidadesPage() {
  await requireStaff();
  const [rows, choices] = await Promise.all([db.select().from(modalities).orderBy(asc(modalities.sortOrder)), getImageChoices()]);
  return (
    <section>
      <div className="admin-heading">
        <div><span>CONTEÚDO</span><h1>Modalidades</h1>
        <p className="admin-page-hint">Gerencia as modalidades exibidas na home e na página de modalidades.</p></div>
        <ModalityForm choices={choices} />
      </div>
      {rows.map((item) => (
        <article className="admin-panel" key={item.id}>
          <div className="admin-row admin-row-head">
            <strong>{item.name}</strong>
            <span>{item.slug}</span>
            <span>{item.active ? "Ativa" : "Inativa"}</span>
          </div>
          <ModalityForm modality={item as unknown as Record<string, unknown>} choices={choices} />
          <div className="admin-list-footer">
            <form action={mutateModality}>
              <input type="hidden" name="intent" value="toggle" />
              <input type="hidden" name="id" value={item.id} />
              <button className="btn small" type="submit">{item.active ? "DESATIVAR" : "ATIVAR"}</button>
            </form>
            <ActionButtons action={mutateModality} id={item.id} />
          </div>
        </article>
      ))}
    </section>
  );
}
