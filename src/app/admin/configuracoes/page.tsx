import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { requireStaff } from "@/core/auth/guards";

export default async function SettingsPage() {
  await requireStaff();
  const row = (await db.select().from(siteSettings).limit(1))[0];
  return <section><div className="admin-heading"><span>SITE</span><h1>Configurações</h1></div><div className="admin-form"><label>Nome<input readOnly value={row?.name || ""} /></label><label>Slogan<input readOnly value={row?.slogan || ""} /></label><p className="muted">Leitura disponível nesta rodada. A edição completa de settings fica no próximo bloco de CRUD.</p></div></section>;
}
