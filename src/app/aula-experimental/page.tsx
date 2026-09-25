import type { Metadata } from "next";

import Link from "next/link";

import { getPublicData, publicMetadata } from "@/lib/queries/public";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getPublicData();

  return publicMetadata(
    settings,
    "Aula experimental",
    "Agende sua aula experimental.",
  );
}

export default async function Page() {
  const { settings } = await getPublicData();
  const phone = (settings?.whatsapp || "").replace(/\D/g, "");
  const href = phone
    ? `https://wa.me/${phone}`
    : "/contato";

  return (
    <main className="page-hero">
      <div className="container prose">
        <span className="eyebrow">PRIMEIRO PASSO</span>
        <h1>AULA EXPERIMENTAL</h1>
        <p>
          Fale com nossa equipe para escolher o melhor horário e receber as
          orientações para seu primeiro treino.
        </p>
        <div className="actions">
          <a className="btn" href={href}>
            AGENDAR PELO WHATSAPP
          </a>
          <Link className="btn secondary" href="/horarios">
            VER HORÁRIOS
          </Link>
        </div>
      </div>
    </main>
  );
}
