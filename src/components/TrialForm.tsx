"use client";

import { useState } from "react";
import { submitTrialLead } from "@/core/leads/actions";

type Modality = { id: string; name: string };

export function TrialForm({ modalities }: { modalities: Modality[] }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function maskPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return "(" + digits.slice(0, 2) + ") " + digits.slice(2);
    return "(" + digits.slice(0, 2) + ") " + digits.slice(2, 7) + "-" + digits.slice(7);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const input = Object.fromEntries(form.entries()) as Record<string, string>;
    input.pagePath = window.location.pathname;
    const result = await submitTrialLead(input);
    if (!result.ok) {
      setStatus("error");
      setMessage(result.error);
      return;
    }
    setStatus("success");
    setMessage("Recebemos seus dados. Abra o WhatsApp para concluir o agendamento.");
    window.location.href = result.url;
  }

  return (
    <form className="trial-form" onSubmit={onSubmit}>
      <label>Nome<input name="name" required minLength={2} maxLength={100} autoComplete="name" /></label>
      <label>WhatsApp<input name="phone" required inputMode="tel" placeholder="(48) 99999-9999" onChange={(event) => { event.currentTarget.value = maskPhone(event.currentTarget.value); }} /></label>
      <label>Modalidade<select name="modalityId" defaultValue=""><option value="">A definir</option>{modalities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <label>Melhor período<select name="preferredTime" required defaultValue=""><option value="">Escolha</option><option>Manhã</option><option>Almoço</option><option>Noite</option><option>Flexível</option></select></label>
      <label className="check"><input type="checkbox" name="consent" required /> Aceito o tratamento dos dados conforme a <a href="/privacidade">política de privacidade</a>.</label>
      <input name="honeypot" tabIndex={-1} autoComplete="off" className="honeypot" aria-hidden="true" />
      <button className="btn" disabled={status === "sending"} type="submit">{status === "sending" ? "ENVIANDO..." : "QUERO MINHA AULA"}</button>
      {message ? <p role={status === "error" ? "alert" : "status"} className={status === "error" ? "form-error" : "form-success"}>{message}</p> : null}
    </form>
  );
}
