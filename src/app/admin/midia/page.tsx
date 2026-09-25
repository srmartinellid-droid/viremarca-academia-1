import { db } from "@/db";
import { media } from "@/db/schema";

export default async function MediaPage() {
  const rows = await db.select().from(media).limit(50);
  return <section><div className="admin-heading"><span>ATIVOS</span><h1>Mídia</h1></div><div className="admin-form"><p className="muted">Uploads físicos devem ser ligados ao storage escolhido no deploy. O painel já lista os registros da biblioteca.</p></div><div className="admin-table">{rows.map((item) => <div className="admin-row" key={item.id}><strong>{item.alt}</strong><span>{item.mimeType}</span><span>{item.sizeBytes} bytes</span></div>)}</div></section>;
}
