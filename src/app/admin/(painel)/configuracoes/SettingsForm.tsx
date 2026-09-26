"use client";

import { useActionState, useState } from "react";

import { ImageField } from "@/components/admin/ImageField";
import type { OpeningHours } from "@/db/schema";
import type { PublicImageChoice } from "@/lib/media/public-images";
import { saveSettings, type SettingsState } from "./actions";

type Exception = { date: string; label: string; closed: boolean; open: string; close: string };
type Values = Record<string, string | boolean | OpeningHours | Exception[]>;
const DAYS = [["mon", "Segunda"], ["tue", "Terça"], ["wed", "Quarta"], ["thu", "Quinta"], ["fri", "Sexta"], ["sat", "Sábado"], ["sun", "Domingo"]] as const;
const initialState: SettingsState = { ok: false, message: "" };

export function SettingsForm({ initial, choices }: { initial: Values; choices: PublicImageChoice[] }) {
  const [state, action, pending] = useActionState(saveSettings, initialState);
  const [tab, setTab] = useState("Identidade");
  const [hours, setHours] = useState<OpeningHours>((initial.openingHours as OpeningHours) || {
    mon: [{ open: "08:00", close: "22:00" }],
    tue: [{ open: "08:00", close: "22:00" }],
    wed: [{ open: "08:00", close: "22:00" }],
    thu: [{ open: "08:00", close: "22:00" }],
    fri: [{ open: "08:00", close: "22:00" }],
    sat: [{ open: "08:00", close: "18:00" }],
    sun: null,
  });
  const [exceptions, setExceptions] = useState<Exception[]>((initial.openingExceptions as Exception[]) || []);
  const updateDay = (day: keyof OpeningHours, patch: Partial<{ open: string; close: string; closed: boolean }>) => {
    setHours((current) => {
      if (patch.closed) return { ...current, [day]: null };
      const range = current[day]?.[0] || { open: "08:00", close: "22:00" };
      return { ...current, [day]: [{ open: patch.open || range.open, close: patch.close || range.close }] };
    });
  };
  const addException = () => setExceptions((items) => [...items, { date: "", label: "", closed: true, open: "", close: "" }]);
  const updateException = (index: number, patch: Partial<Exception>) => setExceptions((items) => items.map((item, i) => i === index ? { ...item, ...patch } : item));

  return (
    <form action={action} className="admin-settings-form">
      <input type="hidden" name="openingHoursJson" value={JSON.stringify(hours)} />
      <input type="hidden" name="openingExceptionsJson" value={JSON.stringify(exceptions)} />
      <div className="admin-tabs" role="tablist" aria-label="Configurações">
        {["Identidade", "Contato", "Endereço e mapa", "Funcionamento", "Redes e SEO", "Opções"].map((item) => (
          <button key={item} type="button" className={tab === item ? "is-active" : ""} onClick={() => setTab(item)}>{item}</button>
        ))}
      </div>

      <section className={tab === "Identidade" ? "admin-settings-tab is-active" : "admin-settings-tab"}>
        <fieldset>
          <legend>Identidade</legend>
          <label>Nome da academia<input name="name" required defaultValue={String(initial.name || "")} /></label>
          <label>Slogan<input name="slogan" defaultValue={String(initial.slogan || "")} /></label>
          <label>Cor de destaque<input name="accentColor" defaultValue={String(initial.accentColor || "#C6FF00")} /></label>
          <div className="admin-accent-preview" style={{ background: String(initial.accentColor || "#C6FF00") }}>Prévia da cor de destaque</div>
          <p className="admin-image-hint">Verifique contraste AA antes de publicar.</p>
          <ImageField name="logoLightUrl" altName="logoLightAlt" label="Logo claro" purpose="logo" value={String(initial.logoLightUrl || "")} altValue="Logo claro da academia" choices={choices} />
          <ImageField name="logoDarkUrl" altName="logoDarkAlt" label="Logo escuro" purpose="logo" value={String(initial.logoDarkUrl || "")} altValue="Logo escuro da academia" choices={choices} />
          <ImageField name="monogramUrl" altName="monogramAlt" label="Monograma" purpose="logo" value={String(initial.monogramUrl || "")} altValue="Monograma da academia" choices={choices} />
        </fieldset>
      </section>

      <section className={tab === "Contato" ? "admin-settings-tab is-active" : "admin-settings-tab"}>
        <fieldset>
          <legend>Contato</legend>
          <label>WhatsApp<input name="whatsapp" defaultValue={String(initial.whatsapp || "")} /></label>
          <label>Mensagem padrão<input name="whatsappMessage" defaultValue={String(initial.whatsappMessage || "")} /></label>
          <label>Telefone<input name="phone" defaultValue={String(initial.phone || "")} /></label>
          <label>E-mail<input name="email" type="email" defaultValue={String(initial.email || "")} /></label>
        </fieldset>
      </section>

      <section className={tab === "Endereço e mapa" ? "admin-settings-tab is-active" : "admin-settings-tab"}>
        <fieldset>
          <legend>Endereço e mapa</legend>
          {[
            ["street", "Rua"],
            ["number", "Número"],
            ["district", "Bairro"],
            ["city", "Cidade"],
            ["state", "Estado"],
            ["zip", "CEP"],
            ["mapEmbedUrl", "Link do mapa (embed)"],
          ].map(([name, label]) => (
            <label key={name}>{label}<input name={name} defaultValue={String(initial[name] || "")} /></label>
          ))}
        </fieldset>
      </section>

      <section className={tab === "Funcionamento" ? "admin-settings-tab is-active" : "admin-settings-tab"}>
        <fieldset>
          <legend>Funcionamento</legend>
          <div className="opening-hours-editor">
            {DAYS.map(([day, label]) => {
              const range = hours[day]?.[0];
              return (
                <div className="opening-hours-row" key={day}>
                  <strong>{label}</strong>
                  <label className="check"><input type="checkbox" checked={!range} onChange={(event) => updateDay(day, { closed: event.target.checked })} /> Fechado</label>
                  <input aria-label={label + " abre"} type="time" value={range?.open || "08:00"} disabled={!range} onChange={(event) => updateDay(day, { open: event.target.value })} />
                  <span>até</span>
                  <input aria-label={label + " fecha"} type="time" value={range?.close || "22:00"} disabled={!range} onChange={(event) => updateDay(day, { close: event.target.value })} />
                </div>
              );
            })}
          </div>
        </fieldset>
        <fieldset>
          <legend>Feriados e exceções</legend>
          {exceptions.map((item, index) => (
            <div className="exception-row" key={item.date + "-" + index}>
              <input type="date" value={item.date} onChange={(event) => updateException(index, { date: event.target.value })} aria-label="Data" />
              <input value={item.label} onChange={(event) => updateException(index, { label: event.target.value })} placeholder="Nome da exceção" aria-label="Nome" />
              <label className="check"><input type="checkbox" checked={item.closed} onChange={(event) => updateException(index, { closed: event.target.checked })} /> Fechado</label>
              <input type="time" value={item.open} disabled={item.closed} onChange={(event) => updateException(index, { open: event.target.value })} aria-label="Abre" />
              <input type="time" value={item.close} disabled={item.closed} onChange={(event) => updateException(index, { close: event.target.value })} aria-label="Fecha" />
              <button type="button" className="admin-danger-button" onClick={() => setExceptions((items) => items.filter((_, i) => i !== index))}>Remover</button>
            </div>
          ))}
          <button type="button" className="admin-icon-button" onClick={addException}>+ Adicionar exceção</button>
        </fieldset>
      </section>

      <section className={tab === "Redes e SEO" ? "admin-settings-tab is-active" : "admin-settings-tab"}>
        <fieldset>
          <legend>Redes e SEO</legend>
          <label>Instagram<input name="instagram" defaultValue={String(initial.instagram || "")} /></label>
          <label>Facebook<input name="facebook" defaultValue={String(initial.facebook || "")} /></label>
          <label>Título no Google<input name="seoTitle" defaultValue={String(initial.seoTitle || "")} /></label>
          <label>Descrição no Google<textarea name="seoDescription" defaultValue={String(initial.seoDescription || "")} /></label>
          <label>Cidade/região alvo<input name="seoRegion" defaultValue={String(initial.seoRegion || "")} /></label>
        </fieldset>
      </section>

      <section className={tab === "Opções" ? "admin-settings-tab is-active" : "admin-settings-tab"}>
        <fieldset>
          <legend>Opções</legend>
          <label className="check"><input type="checkbox" name="wellhubEnabled" defaultChecked={Boolean(initial.wellhubEnabled)} /> Aceita Wellhub</label>
          <label className="check"><input type="checkbox" name="totalpassEnabled" defaultChecked={Boolean(initial.totalpassEnabled)} /> Aceita TotalPass</label>
          <label className="check"><input type="checkbox" name="isDemo" defaultChecked={Boolean(initial.isDemo)} /> Site demonstrativo</label>
        </fieldset>
      </section>

      <div className="admin-sticky-save">
        <button className="btn" disabled={pending}>{pending ? "SALVANDO…" : "SALVAR CONFIGURAÇÕES"}</button>
        {state.message ? <p role="status" className={state.ok ? "form-ok" : "form-error"}>{state.message}</p> : null}
      </div>
    </form>
  );
}
