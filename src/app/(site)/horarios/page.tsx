import type { Metadata } from "next";

import { ScheduleGrid } from "@/components/ScheduleGrid";
import { getPublicData, publicMetadata } from "@/lib/queries/public";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getPublicData();
  return publicMetadata(settings, "Horários", "Consulte a grade de horários da academia.", "/horarios");
}

export default async function Page() {
  const { schedule, modalities } = await getPublicData();
  const items = schedule.map((item) => ({
    id: item.id, weekday: item.weekday, startsAt: item.startsAt, endsAt: item.endsAt, room: item.room,
    modalityName: modalities.find((modality) => modality.id === item.modalityId)?.name || "Aula",
  }));
  return (
    <main className="page-hero">
      <div className="container"><span className="eyebrow">GRADE</span><h1>HORÁRIOS</h1><ScheduleGrid items={items} /></div>
    </main>
  );
}
