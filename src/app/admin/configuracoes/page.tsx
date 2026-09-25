import { db } from "@/db";
import { siteSettings } from "@/db/schema";

export default async function SettingsPage() {
  const row = (await db.select().from(siteSettings).limit(1))[0];
  return <section><div className="admin-heading"><span>SITE</span><h1>Configurações</h1></div><div className="admin-form"><label>Nome<input readOnly value={row?.name || ""} /></label><label>Slogan<input readOnly value={row?.slogan || ""} /></label><p className="muted">A edição completa de configurações fica preparada para a próxima expansão do CRUD.</p></div></section>;
}
