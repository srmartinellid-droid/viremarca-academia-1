import type { Metadata } from "next";

import { TrialForm } from "@/components/TrialForm";
import { getPublicData, publicMetadata } from "@/lib/queries/public";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getPublicData();
  return publicMetadata(settings, "Aula experimental", "Agende sua aula experimental.", "/aula-experimental");
}

export default async function Page() {
  const { settings, modalities } = await getPublicData();
  return (
    <main className="page-hero">
      <div className="container trial-page">
        <span className="eyebrow">PRIMEIRO PASSO</span>
        <h1>AULA EXPERIMENTAL</h1>
        <p>Preencha os dados. Depois, continue pelo WhatsApp demonstrativo.</p>
        <TrialForm modalities={modalities.map((item) => ({ id: item.id, name: item.name }))} />
        <p className="muted">Contato demo: {settings?.phone || "(00) 00000-0000"}</p>
      </div>
    </main>
  );
}
