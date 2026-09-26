import { asc } from "drizzle-orm";

import { ActionButtons } from "@/components/admin/ActionButtons";
import { db } from "@/db";
import { stats } from "@/db/schema";
import { requireStaff } from "@/core/auth/guards";
import { mutateStat } from "./actions";
import { StatForm } from "./Form";

export default async function NumerosPage() {
  await requireStaff();
  const rows = await db.select().from(stats).orderBy(asc(stats.sortOrder));
  return (
    <section>
      <div className="admin-heading"><div><span>CONTEÚDO</span><h1>Números</h1></div><StatForm /></div>
      {rows.map((row) => (
        <article className="admin-panel" key={row.id}>
          <div className="admin-row admin-row-head"><strong>{row.value}{row.suffix}</strong><span>{row.label}</span><span>{row.active ? "Ativo" : "Inativo"}</span></div>
          <StatForm item={row as unknown as Record<string, unknown>} />
          <div className="admin-list-footer"><ActionButtons action={mutateStat} id={row.id} /></div>
        </article>
      ))}
    </section>
  );
}
