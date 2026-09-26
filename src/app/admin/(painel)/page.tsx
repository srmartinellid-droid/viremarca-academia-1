import Link from "next/link";
import { and, count, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { analyticsEvents, leads } from "@/db/schema";
import { requireStaff } from "@/core/auth/guards";

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);

export default async function AdminDashboard() {
  await requireStaff();
  const [l7, l30, fresh, enrolled, wa30, recent, perDay, origins] = await Promise.all([
    db
      .select({ n: count() })
      .from(leads)
      .where(gte(leads.createdAt, daysAgo(7))),
    db
      .select({ n: count() })
      .from(leads)
      .where(gte(leads.createdAt, daysAgo(30))),
    db.select({ n: count() }).from(leads).where(eq(leads.status, "novo")),
    db
      .select({ n: count() })
      .from(leads)
      .where(and(eq(leads.status, "matriculado"), gte(leads.createdAt, daysAgo(30)))),
    db
      .select({ n: count() })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.name, "whatsapp_click"),
          gte(analyticsEvents.createdAt, daysAgo(30)),
        ),
      ),
    db.select().from(leads).orderBy(desc(leads.createdAt)).limit(5),
    db
      .select({
        day: sql<string>`to_char(${leads.createdAt} at time zone 'America/Sao_Paulo', 'YYYY-MM-DD')`,
        n: count(),
      })
      .from(leads)
      .where(gte(leads.createdAt, daysAgo(30)))
      .groupBy(sql`1`),
    db
      .select({ origin: analyticsEvents.origin, n: count() })
      .from(analyticsEvents)
      .where(gte(analyticsEvents.createdAt, daysAgo(30)))
      .groupBy(analyticsEvents.origin)
      .orderBy(desc(count()))
      .limit(5),
  ]);

  const leads30 = l30[0]?.n ?? 0;
  const conversion = leads30 ? Math.round(((enrolled[0]?.n ?? 0) / leads30) * 100) : 0;
  const byDay = new Map(perDay.map((d) => [d.day, d.n]));
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = daysAgo(29 - i).toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" });
    return { d, n: byDay.get(d) ?? 0 };
  });
  const max = Math.max(1, ...days.map((d) => d.n));

  const cards = [
    ["Leads · 7 dias", l7[0]?.n ?? 0],
    ["Leads · 30 dias", leads30],
    ["Aguardando contato", fresh[0]?.n ?? 0],
    ["Matrícula · 30 dias", `${conversion}%`],
    ["Cliques no WhatsApp · 30 dias", wa30[0]?.n ?? 0],
  ] as const;

  return (
    <section>
      <div className="admin-heading">
        <span>PAINEL</span>
        <h1>Visão geral</h1>
      </div>
      <div className="admin-cards">
        {cards.map(([label, value]) => (
          <article key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </div>
      <div className="admin-panel">
        <h2>Leads por dia (30 dias)</h2>
        <svg viewBox="0 0 300 80" className="admin-chart" role="img" aria-label="Leads por dia">
          {days.map((d, i) => {
            const h = (d.n / max) * 70;
            return (
              <rect key={d.d} x={i * 10 + 1} y={78 - h} width="8" height={Math.max(h, 1)} rx="1">
                <title>{`${d.d}: ${d.n}`}</title>
              </rect>
            );
          })}
        </svg>
      </div>
      <div className="admin-grid-2">
        <div className="admin-panel">
          <h2>Últimos leads</h2>
          {recent.length === 0 ? <p className="muted">Nenhum lead ainda.</p> : null}
          {recent.map((lead) => (
            <div className="admin-row" key={lead.id}>
              <strong>{lead.name}</strong>
              <span>{lead.phone}</span>
              <span>{lead.status}</span>
            </div>
          ))}
          <Link href="/admin/leads">Ver todos →</Link>
        </div>
        <div className="admin-panel">
          <h2>Origem dos cliques (30 dias)</h2>
          {origins.length === 0 ? <p className="muted">Sem eventos ainda.</p> : null}
          {origins.map((o) => (
            <div className="admin-row" key={o.origin ?? "—"}>
              <strong>{o.origin ?? "—"}</strong>
              <span>{o.n}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
