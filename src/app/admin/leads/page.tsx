import { desc } from "drizzle-orm";
import { db } from "@/db";
import { leads } from "@/db/schema";

export default async function AdminLeads() {
  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(100);
  return (
    <section><div className="admin-heading"><span>CRM</span><h1>Leads</h1></div>
      <div className="admin-table"><div className="admin-row admin-row-head"><strong>Nome</strong><span>WhatsApp</span><span>Status</span><span>Origem</span></div>
        {rows.map((lead) => <div className="admin-row" key={lead.id}><strong>{lead.name}</strong><span>{lead.phone}</span><span>{lead.status}</span><span>{lead.source}</span></div>)}
      </div>
    </section>
  );
}
