import { asc } from "drizzle-orm";

import { ActionButtons } from "@/components/admin/ActionButtons";
import { getImageChoices } from "@/lib/media/public-images";
import { db } from "@/db";
import { instructors } from "@/db/schema";
import { requireStaff } from "@/core/auth/guards";
import { mutateInstructor } from "./actions";
import { InstructorForm } from "./Form";
import { AdminModal } from "@/components/admin/AdminModal";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function EquipePage() {
  await requireStaff();
  const [rows, choices] = await Promise.all([db.select().from(instructors).orderBy(asc(instructors.sortOrder)), getImageChoices()]);
  return (
    <section className="admin-resource-page">
      <div className="admin-heading"><div><span>CONTEÚDO</span><h1>Equipe</h1>
        <p className="admin-page-hint">Gerencia os instrutores exibidos na seção de equipe e nos conteúdos relacionados às aulas.</p></div><AdminModal title="Novo profissional" triggerLabel="+ NOVO PROFISSIONAL"><InstructorForm choices={choices} /></AdminModal></div>
      {rows.map((row) => (
        <article className="admin-panel" key={row.id}>
          <div className="admin-row admin-row-head"><strong>{row.name}</strong><span>{row.role}</span><span>{row.active ? "Ativo" : "Inativo"}</span></div>
          <AdminModal title="Editar profissional" triggerLabel="Editar profissional" footer={<form action={mutateInstructor}><input type="hidden" name="intent" value="delete" /><input type="hidden" name="id" value={row.id} /><DeleteButton /></form>}><InstructorForm item={row as unknown as Record<string, unknown>} choices={choices} /></AdminModal>
          <div className="admin-list-footer"><ActionButtons action={mutateInstructor} id={row.id} canDelete={false} /></div>
        </article>
      ))}
    </section>
  );
}
