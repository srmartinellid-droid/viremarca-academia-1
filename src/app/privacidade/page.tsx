import type { Metadata } from "next";

import { getPublicData } from "@/lib/queries/public";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getPublicData();

  return {
    title: `Privacidade | ${settings?.name || "Academia"}`,
    description: "Política de privacidade e tratamento de dados.",
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function Page() {
  return (
    <main className="page-hero">
      <article className="container prose">
        <span className="eyebrow">LEGAL</span>
        <h1>PRIVACIDADE</h1>
        <p>
          Esta página apresenta as informações de privacidade do site. Dados
          enviados pelos formulários são tratados apenas para atendimento,
          comunicação e operação dos serviços solicitados.
        </p>
        <p>
          Para dúvidas ou solicitações relacionadas aos seus dados, utilize os
          canais de contato informados no site.
        </p>
      </article>
    </main>
  );
}
