"use client";

import { useActionState } from "react";
import { saveSettings, type SettingsState } from "./actions";

type Values = Record<string, string | boolean>;

const GROUPS: { title: string; fields: [string, string, string?][] }[] = [
  {
    title: "Identidade",
    fields: [
      ["name", "Nome da academia"],
      ["slogan", "Slogan"],
      ["accentColor", "Cor de destaque (#RRGGBB)", "color"],
    ],
  },
  {
    title: "Contato",
    fields: [
      ["whatsapp", "WhatsApp (+5548999999999)"],
      ["whatsappMessage", "Mensagem padrão do WhatsApp"],
      ["phone", "Telefone"],
      ["email", "E-mail", "email"],
    ],
  },
  {
    title: "Endereço",
    fields: [
      ["street", "Rua"],
      ["number", "Número"],
      ["district", "Bairro"],
      ["city", "Cidade"],
      ["state", "UF"],
      ["zip", "CEP"],
      ["mapEmbedUrl", "Link de incorporação do Google Maps"],
    ],
  },
  {
    title: "Aviso no topo do site",
    fields: [
      ["notice", "Texto do aviso (vazio = sem aviso)"],
      ["noticeExpiresAt", "Mostrar até", "date"],
    ],
  },
  {
    title: "Redes e SEO",
    fields: [
      ["instagram", "Instagram (URL)"],
      ["facebook", "Facebook (URL)"],
      ["seoTitle", "Título no Google (até 70)"],
      ["seoDescription", "Descrição no Google (até 170)"],
      ["seoRegion", "Cidade/região alvo"],
    ],
  },
];

const initialState: SettingsState = { ok: false, message: "" };

export function SettingsForm({ initial }: { initial: Values }) {
  const [state, action, pending] = useActionState(saveSettings, initialState);
  return (
    <form action={action} className="admin-form admin-form-wide">
      {GROUPS.map((group) => (
        <fieldset key={group.title}>
          <legend>{group.title}</legend>
          {group.fields.map(([name, label, type]) => (
            <label key={name}>
              {label}
              <input name={name} type={type || "text"} defaultValue={String(initial[name] ?? "")} />
            </label>
          ))}
        </fieldset>
      ))}
      <fieldset>
        <legend>Opções</legend>
        <label className="check">
          <input
            type="checkbox"
            name="wellhubEnabled"
            defaultChecked={Boolean(initial.wellhubEnabled)}
          />
          Aceita Wellhub
        </label>
        <label className="check">
          <input
            type="checkbox"
            name="totalpassEnabled"
            defaultChecked={Boolean(initial.totalpassEnabled)}
          />
          Aceita TotalPass
        </label>
        <label className="check">
          <input type="checkbox" name="isDemo" defaultChecked={Boolean(initial.isDemo)} />
          Site demonstrativo (mostra a faixa VireMarca)
        </label>
      </fieldset>
      <button className="btn" disabled={pending}>
        {pending ? "SALVANDO…" : "SALVAR CONFIGURAÇÕES"}
      </button>
      {state.message ? (
        <p role="status" className={state.ok ? "form-ok" : "form-error"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
