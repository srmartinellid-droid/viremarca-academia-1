import type { Metadata } from "next";

import { getPublicData, publicMetadata } from "@/lib/queries/public";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getPublicData();

  return publicMetadata(
    settings,
    "Contato",
    "Fale com a equipe da academia.",
  );
}

export default async function Page() {
  const { settings } = await getPublicData();
  const phone = (settings?.whatsapp || "").replace(/\D/g, "");
  const whatsapp = phone
    ? `https://wa.me/${phone}`
    : "/aula-experimental";

  return (
    <main className="page-hero">
      <div className="container prose">
        <span className="eyebrow">FALE COM A EQUIPE</span>
        <h1>CONTATO</h1>
        <p className="muted">
          {settings?.phone || "Telefone não cadastrado"} ·{" "}
          {settings?.email || "E-mail não cadastrado"}
        </p>
        <p>{formatAddress(settings?.address)}</p>
        <div className="actions">
          <a className="btn" href={whatsapp}>
            WHATSAPP
          </a>
          {settings?.mapEmbedUrl && (
            <a
              className="btn secondary"
              href={settings.mapEmbedUrl}
              rel="noreferrer"
            >
              COMO CHEGAR
            </a>
          )}
        </div>
      </div>
    </main>
  );
}

function formatAddress(address: unknown) {
  if (!address || typeof address !== "object") {
    return "Endereço disponível em breve.";
  }

  const value = address as {
    street?: string;
    number?: string;
    district?: string;
    city?: string;
    state?: string;
  };

  return [
    value.street && value.number
      ? `${value.street}, ${value.number}`
      : value.street,
    value.district,
    value.city,
    value.state,
  ]
    .filter(Boolean)
    .join(" · ") || "Endereço disponível em breve.";
}
