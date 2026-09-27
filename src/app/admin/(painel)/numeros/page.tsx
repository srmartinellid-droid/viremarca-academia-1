import { asc } from "drizzle-orm";

import { ActionButtons } from "@/components/admin/ActionButtons";
import { db } from "@/db";
import { stats } from "@/db/schema";
import { requireStaff } from "@/core/auth/guards";
import { mutateStat } from "./actions";
import { StatForm } from "./Form";
import { AdminModal } from "@/components/admin/AdminModal";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function NumerosPage() {
  await requireStaff();
  const rows = await db.select().from(stats).orderBy(asc(stats.sortOrder));
  return (
    <section className="admin-resource-page">
      <div className="admin-heading"><div><span>CONTEÚDO</span><h1>Números</h1>
        <p className="admin-page-hint">Estes valores aparecem na faixa de estatísticas logo abaixo do hero, na home.</p></div><AdminModal eyebrow="CADASTRO" title="Novo número" triggerLabel="+ NOVO NÚMERO"><StatForm /></AdminModal></div>
      {rows.map((row) => (
        <article className="admin-panel" key={row.id}>
          <div className="admin-row admin-row-head"><strong>{row.value}{row.suffix}</strong><span>{row.label}</span><span>{row.active ? "Ativo" : "Inativo"}</span></div>
          <AdminModal title="Editar número" triggerLabel="Editar número" footer={<form action={mutateStat}><input type="hidden" name="intent" value="delete" /><input type="hidden" name="id" value={row.id} /><DeleteButton /></form>}><StatForm item={row as unknown as Record<string, unknown>} /></AdminModal>
          <div className="admin-list-footer"><ActionButtons action={mutateStat} id={row.id} canDelete={false} /></div>
        </article>
      ))}
    </section>
  );
}
