import { asc } from "drizzle-orm";

import { ActionButtons } from "@/components/admin/ActionButtons";
import { requireStaff } from "@/core/auth/guards";
import { db } from "@/db";
import { classSchedule, instructors, modalities } from "@/db/schema";
import { mutateSchedule } from "./actions";
import { ScheduleForm } from "./Form";

export default async function HorariosPage() {
  await requireStaff();
  const [rows, mods, team] = await Promise.all([
    db.select().from(classSchedule).orderBy(asc(classSchedule.weekday), asc(classSchedule.startsAt)),
    db.select().from(modalities).orderBy(asc(modalities.sortOrder)),
    db.select().from(instructors).orderBy(asc(instructors.sortOrder)),
  ]);
  const names = new Map(mods.map((m) => [m.id, m.name]));
  return (
    <section>
      <div className="admin-heading"><div><span>CONTEÚDO</span><h1>Horários</h1>
        <p className="admin-page-hint">Organiza os horários de aulas exibidos no site, por modalidade e instrutor.</p></div><ScheduleForm modalities={mods as unknown as Array<Record<string, unknown>>} instructors={team as unknown as Array<Record<string, unknown>>} /></div>
      {rows.map((row) => (
        <article className="admin-panel" key={row.id}>
          <div className="admin-row admin-row-head"><strong>{names.get(row.modalityId)}</strong><span>{row.weekday} · {String(row.startsAt).slice(0, 5)}–{String(row.endsAt).slice(0, 5)}</span><span>{row.active ? "Ativo" : "Inativo"}</span></div>
          <ScheduleForm item={row as unknown as Record<string, unknown>} modalities={mods as unknown as Array<Record<string, unknown>>} instructors={team as unknown as Array<Record<string, unknown>>} />
          <div className="admin-list-footer"><ActionButtons action={mutateSchedule} id={row.id} /></div>
        </article>
      ))}
    </section>
  );
}
