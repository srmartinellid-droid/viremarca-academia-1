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
  const [accentColor, setAccentColor] = useState(
    /^#[0-9A-Fa-f]{6}$/.test(String(initial.accentColor || "")) ? String(initial.accentColor) : "#C6FF00",
  );
  const [hours, setHours] = useState<OpeningHours>((initial.openingHours as OpeningHours) || {
    mon: [{ open: "08:00", close: "22:00" }], tue: [{ open: "08:00", close: "22:00" }],
    wed: [{ open: "08:00", close: "22:00" }], thu: [{ open: "08:00", close: "22:00" }],
    fri: [{ open: "08:00", close: "22:00" }], sat: [{ open: "08:00", close: "18:00" }], sun: null,
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

      <div className="admin-tabs" role="tablist" aria-label="Configurações do site">
        {["Identidade", "Contato", "Endereço e mapa", "Funcionamento", "Redes e SEO", "Avisos", "Opções"].map((item) => (
          <button key={item} type="button" role="tab" aria-selected={tab === item} className={tab === item ? "is-active" : ""} onClick={() => setTab(item)}>{item}</button>
        ))}
      </div>

      <section className={tab === "Identidade" ? "admin-settings-tab is-active" : "admin-settings-tab"}>
        <fieldset className="admin-settings-card">
          <legend>Identidade visual</legend>
          <p className="admin-field-help admin-settings-intro">Nome, assinatura e ativos principais da marca. Os blocos de imagem seguem o mesmo padrão de card usado no restante do painel.</p>
          <div className="admin-settings-grid">
            <label>Nome da academia<input name="name" required defaultValue={String(initial.name || "")} /></label>
            <label>Slogan<input name="slogan" defaultValue={String(initial.slogan || "")} /></label>
            <div className="admin-color-field">
              <label htmlFor="accentColor">Cor de destaque</label>
              <div className="admin-color-control">
                <input id="accentColorPicker" type="color" value={accentColor} aria-label="Selecionar cor de destaque" onChange={(event) => setAccentColor(event.target.value.toUpperCase())} />
                <input id="accentColor" name="accentColor" value={accentColor} pattern="^#[0-9A-Fa-f]{6}$" maxLength={7} onChange={(event) => setAccentColor(event.target.value.toUpperCase())} />
              </div>
              <div className="admin-accent-preview" style={{ background: accentColor }}>Prévia da cor de destaque</div>
            </div>
          </div>
          <p className="admin-image-hint admin-settings-intro">Escolha a cor pelo seletor ou informe o hexadecimal. A prévia usa a mesma cor que será aplicada no site.</p>
        </fieldset>
        <div className="admin-settings-image-grid">
          <ImageField name="logoLightUrl" altName="logoLightAlt" label="Logo para fundo escuro" purpose="logo" value={String(initial.logoLightUrl || "")} altValue="Logo claro da academia" choices={choices} />
          <ImageField name="logoDarkUrl" altName="logoDarkAlt" label="Logo para fundo claro" purpose="logo" value={String(initial.logoDarkUrl || "")} altValue="Logo escuro da academia" choices={choices} />
          <ImageField name="monogramUrl" altName="monogramAlt" label="Símbolo / monograma" purpose="logo" value={String(initial.monogramUrl || "")} altValue="Monograma da academia" choices={choices} />
        </div>
      </section>

      <section className={tab === "Contato" ? "admin-settings-tab is-active" : "admin-settings-tab"}>
        <fieldset className="admin-settings-card">
          <legend>Contato</legend>
          <p className="admin-field-help admin-settings-intro">Canais usados nos botões de conversão, rodapé e páginas de contato.</p>
          <div className="admin-settings-grid">
            <label>WhatsApp<input name="whatsapp" defaultValue={String(initial.whatsapp || "")} /></label>
            <label>Mensagem padrão<input name="whatsappMessage" defaultValue={String(initial.whatsappMessage || "")} /></label>
            <label>Telefone<input name="phone" defaultValue={String(initial.phone || "")} /></label>
            <label>E-mail<input name="email" type="email" defaultValue={String(initial.email || "")} /></label>
          </div>
        </fieldset>
      </section>

      <section className={tab === "Endereço e mapa" ? "admin-settings-tab is-active" : "admin-settings-tab"}>
        <fieldset className="admin-settings-card">
          <legend>Endereço e mapa</legend>
          <p className="admin-field-help admin-settings-intro">Dados físicos da unidade e endereço usado para mapas e informações locais.</p>
          <div className="admin-settings-grid">
            {[
              ["street", "Rua"], ["number", "Número"], ["district", "Bairro"], ["city", "Cidade"], ["state", "Estado"], ["zip", "CEP"],
            ].map(([name, label]) => <label key={name}>{label}<input name={name} defaultValue={String(initial[name] || "")} /></label>)}
            <label className="admin-settings-span-2">Link do mapa (embed)<input name="mapEmbedUrl" defaultValue={String(initial.mapEmbedUrl || "")} /></label>
          </div>
        </fieldset>
      </section>

      <section className={tab === "Funcionamento" ? "admin-settings-tab is-active" : "admin-settings-tab"}>
        <fieldset className="admin-settings-card">
          <legend>Horários regulares</legend>
          <p className="admin-field-help admin-settings-intro">Defina a janela de atendimento de cada dia. Desative o dia quando a unidade estiver fechada.</p>
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

        <fieldset className="admin-settings-card">
          <legend>Feriados e exceções</legend>
          <p className="admin-field-help admin-settings-intro">Crie alterações pontuais sem precisar alterar o horário semanal.</p>
          {exceptions.length ? exceptions.map((item, index) => (
            <div className="exception-row" key={item.date + "-" + index}>
              <input type="date" value={item.date} onChange={(event) => updateException(index, { date: event.target.value })} aria-label="Data" />
              <input value={item.label} onChange={(event) => updateException(index, { label: event.target.value })} placeholder="Nome da exceção" aria-label="Nome" />
              <label className="check"><input type="checkbox" checked={item.closed} onChange={(event) => updateException(index, { closed: event.target.checked })} /> Fechado</label>
              <input type="time" value={item.open} disabled={item.closed} onChange={(event) => updateException(index, { open: event.target.value })} aria-label="Abre" />
              <input type="time" value={item.close} disabled={item.closed} onChange={(event) => updateException(index, { close: event.target.value })} aria-label="Fecha" />
              <button type="button" className="admin-danger-button" onClick={() => setExceptions((items) => items.filter((_, i) => i !== index))}>Remover</button>
            </div>
          )) : <p className="admin-image-hint">Nenhuma exceção cadastrada.</p>}
          <button type="button" className="admin-icon-button" onClick={addException}>+ Adicionar exceção</button>
        </fieldset>
      </section>

      <section className={tab === "Redes e SEO" ? "admin-settings-tab is-active" : "admin-settings-tab"}>
        <fieldset className="admin-settings-card">
          <legend>Redes e SEO</legend>
          <p className="admin-field-help admin-settings-intro">Presença social e metadados para busca e compartilhamento.</p>
          <div className="admin-settings-grid">
            <label>Instagram<input name="instagram" defaultValue={String(initial.instagram || "")} /></label>
            <label>Facebook<input name="facebook" defaultValue={String(initial.facebook || "")} /></label>
            <label>Título no Google<input name="seoTitle" defaultValue={String(initial.seoTitle || "")} /></label>
            <label>Cidade/região alvo<input name="seoRegion" defaultValue={String(initial.seoRegion || "")} /></label>
            <label className="admin-settings-span-2">Descrição no Google<textarea name="seoDescription" defaultValue={String(initial.seoDescription || "")} /></label>
          </div>
        </fieldset>
      </section>

      <section className={tab === "Avisos" ? "admin-settings-tab is-active" : "admin-settings-tab"}>
        <fieldset className="admin-settings-card">
          <legend>Aviso do site</legend>
          <p className="admin-field-help admin-settings-intro">Mensagem temporária para novidades, horários especiais ou alertas. Deixe em branco quando não houver aviso.</p>
          <div className="admin-settings-grid">
            <label className="admin-settings-span-2">Mensagem<textarea name="notice" defaultValue={String(initial.notice || "")} placeholder="Ex.: Feriado: funcionamento especial neste sábado." /></label>
            <label>Exibir até<input name="noticeExpiresAt" type="date" defaultValue={String(initial.noticeExpiresAt || "")} /></label>
          </div>
        </fieldset>
      </section>

      <section className={tab === "Opções" ? "admin-settings-tab is-active" : "admin-settings-tab"}>
        <fieldset className="admin-settings-card">
          <legend>Opções</legend>
          <p className="admin-field-help admin-settings-intro">Recursos de integração e identificação do ambiente demonstrativo.</p>
          <div className="admin-settings-options">
            <label className="check"><input type="checkbox" name="wellhubEnabled" defaultChecked={Boolean(initial.wellhubEnabled)} /> Aceita Wellhub</label>
            <label className="check"><input type="checkbox" name="totalpassEnabled" defaultChecked={Boolean(initial.totalpassEnabled)} /> Aceita TotalPass</label>
            <label className="check"><input type="checkbox" name="isDemo" defaultChecked={Boolean(initial.isDemo)} /> Site demonstrativo</label>
          </div>
        </fieldset>
      </section>

      <div className="admin-sticky-save">
        <button className="btn" disabled={pending}>{pending ? "SALVANDO…" : "SALVAR CONFIGURAÇÕES"}</button>
        {state.message ? <p role="status" className={state.ok ? "form-ok" : "form-error"}>{state.message}</p> : null}
      </div>
    </form>
  );
}
