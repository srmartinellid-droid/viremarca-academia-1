import { asc } from "drizzle-orm";

import { ActionButtons } from "@/components/admin/ActionButtons";
import { db } from "@/db";
import { instructors } from "@/db/schema";
import { requireStaff } from "@/core/auth/guards";
import { mutateInstructor } from "./actions";
import { InstructorForm } from "./Form";

export default async function EquipePage() {
  await requireStaff();
  const rows = await db.select().from(instructors).orderBy(asc(instructors.sortOrder));
  return (
    <section>
      <div className="admin-heading"><div><span>CONTEÚDO</span><h1>Equipe</h1></div><InstructorForm /></div>
      {rows.map((row) => (
        <article className="admin-panel" key={row.id}>
          <div className="admin-row admin-row-head"><strong>{row.name}</strong><span>{row.role}</span><span>{row.active ? "Ativo" : "Inativo"}</span></div>
          <InstructorForm item={row as unknown as Record<string, unknown>} />
          <div className="admin-list-footer"><ActionButtons action={mutateInstructor} id={row.id} /></div>
        </article>
      ))}
    </section>
  );
}
