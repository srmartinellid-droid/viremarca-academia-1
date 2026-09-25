import { db } from "@/db";
import { media } from "@/db/schema";
import { requireStaff } from "@/core/auth/guards";

export default async function MediaPage() {
  await requireStaff();
  const rows = await db.select().from(media).limit(50);
  return <section><div className="admin-heading"><span>ATIVOS</span><h1>Mídia</h1></div><div className="admin-form"><p className="muted">A biblioteca está ligada aos registros de mídia. Upload binário fica pendente da conexão de storage autorizada.</p></div><div className="admin-table">{rows.map((item) => <div className="admin-row" key={item.id}><strong>{item.alt}</strong><span>{item.mimeType}</span><span>{item.sizeBytes} bytes</span></div>)}</div></section>;
}
