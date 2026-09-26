"use client";

import { mutateSchedule } from "./actions";

export function ScheduleForm({ item, modalities, instructors }: { item?: Record<string, unknown>; modalities: Array<Record<string, unknown>>; instructors: Array<Record<string, unknown>> }) {
  return (
    <form className="admin-form admin-crud-form" action={mutateSchedule}>
      {item?.id ? <input type="hidden" name="id" value={String(item.id)} /> : null}
      <input type="hidden" name="intent" value="save" />
      <label>Modalidade<select name="modalityId" required defaultValue={String(item?.modalityId || "")}>{modalities.map((m) => <option value={String(m.id)} key={String(m.id)}>{String(m.name)}</option>)}</select></label>
      <label>Professor<select name="instructorId" defaultValue={String(item?.instructorId || "")}><option value="">Sem professor</option>{instructors.map((i) => <option value={String(i.id)} key={String(i.id)}>{String(i.name)}</option>)}</select></label>
      <label>Dia<select name="weekday" defaultValue={String(item?.weekday ?? 1)}>{["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"].map((d, i) => <option value={i} key={d}>{d}</option>)}</select></label>
      <label>Início<input name="startsAt" type="time" required defaultValue={String(item?.startsAt || "06:00").slice(0, 5)} /></label>
      <label>Fim<input name="endsAt" type="time" required defaultValue={String(item?.endsAt || "07:00").slice(0, 5)} /></label>
      <label>Sala<input name="room" defaultValue={String(item?.room || "")} /></label>
      <label className="check"><input name="active" type="checkbox" defaultChecked={item?.active !== false} />Ativo</label>
      <button className="btn">SALVAR HORÁRIO</button>
    </form>
  );
}
