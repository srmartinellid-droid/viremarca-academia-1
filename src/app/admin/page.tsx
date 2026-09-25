import { desc } from "drizzle-orm";
import { db } from "@/db";
import { analyticsEvents, leads } from "@/db/schema";
import { requireStaff } from "@/core/auth/guards";

export default async function AdminDashboard() {
  await requireStaff();
  const [recentLeads, recentEvents] = await Promise.all([
    db.select().from(leads).orderBy(desc(leads.createdAt)).limit(8),
    db.select().from(analyticsEvents).orderBy(desc(analyticsEvents.createdAt)).limit(8),
  ]);
  return (
    <section>
      <div className="admin-heading"><span>PAINEL</span><h1>Visão geral</h1></div>
      <div className="admin-cards">
        <article><strong>{recentLeads.length}</strong><span>Leads recentes</span></article>
        <article><strong>{recentEvents.length}</strong><span>Eventos recentes</span></article>
      </div>
      <div className="admin-table"><h2>Últimos leads</h2>
        {recentLeads.map((lead) => <div className="admin-row" key={lead.id}><strong>{lead.name}</strong><span>{lead.phone}</span><span>{lead.status}</span></div>)}
      </div>
    </section>
  );
}
