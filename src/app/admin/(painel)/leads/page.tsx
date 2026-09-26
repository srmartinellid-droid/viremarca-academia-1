import Link from "next/link";
import { and, count, desc, eq, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { leads, modalities } from "@/db/schema";
import { requireStaff } from "@/core/auth/guards";
import { updateLeadStatus } from "./actions";

const STATUS: Record<string, string> = {
  novo: "Novo",
  em_contato: "Em contato",
  matriculado: "Matriculado",
  perdido: "Perdido",
};
const PAGE = 20;

export default async function AdminLeads({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  await requireStaff();
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const where: SQL[] = [];
  if (sp.status && sp.status in STATUS) where.push(eq(leads.status, sp.status as "novo"));
  const filter = where.length ? and(...where) : undefined;

  const [rows, total] = await Promise.all([
    db
      .select({
        id: leads.id,
        name: leads.name,
        phone: leads.phone,
        status: leads.status,
        source: leads.source,
        preferredTime: leads.preferredTime,
        notes: leads.notes,
        createdAt: leads.createdAt,
        modality: modalities.name,
      })
      .from(leads)
      .leftJoin(modalities, eq(leads.modalityId, modalities.id))
      .where(filter)
      .orderBy(desc(leads.createdAt))
      .limit(PAGE)
      .offset((page - 1) * PAGE),
    db.select({ n: count() }).from(leads).where(filter),
  ]);
  const pages = Math.max(1, Math.ceil((total[0]?.n ?? 0) / PAGE));

  return (
    <section>
      <div className="admin-heading">
        <span>CRM</span>
        <h1>Leads</h1>
        <a className="btn secondary" href="/admin/leads/export">
          EXPORTAR CSV
        </a>
      </div>
      <nav className="admin-filters" aria-label="Filtrar por status">
        <Link href="/admin/leads" className={!sp.status ? "active" : ""}>
          Todos
        </Link>
        {Object.entries(STATUS).map(([key, label]) => (
          <Link
            key={key}
            href={`/admin/leads?status=${key}`}
            className={sp.status === key ? "active" : ""}
          >
            {label}
          </Link>
        ))}
      </nav>
      {rows.length === 0 ? (
        <p className="muted">
          Nenhum lead ainda. Eles chegam pelo formulário de aula experimental.
        </p>
      ) : (
        <div className="lead-list">
          {rows.map((lead) => {
            const digits = lead.phone.replace(/\D/g, "");
            const wa = `https://wa.me/${digits.startsWith("55") ? digits : "55" + digits}?text=${encodeURIComponent(
              `Olá, ${lead.name.split(" ")[0]}! Aqui é da academia, sobre sua aula experimental.`,
            )}`;
            return (
              <article className="lead-card" key={lead.id}>
                <header>
                  <strong>{lead.name}</strong>
                  <span className={`status status-${lead.status}`}>{STATUS[lead.status]}</span>
                </header>
                <p className="muted">
                  {lead.phone} · {lead.modality ?? "sem modalidade"} · {lead.preferredTime ?? "—"} ·{" "}
                  {lead.createdAt.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}
                </p>
                <form action={updateLeadStatus} className="lead-actions">
                  <input type="hidden" name="id" value={lead.id} />
                  <select name="status" defaultValue={lead.status} aria-label="Status">
                    {Object.entries(STATUS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <input
                    name="note"
                    placeholder="Nota (opcional)"
                    defaultValue={lead.notes ?? ""}
                  />
                  <button className="btn small">Salvar</button>
                  <a
                    className="btn small secondary"
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                </form>
              </article>
            );
          })}
        </div>
      )}
      {pages > 1 ? (
        <nav className="admin-filters" aria-label="Paginação">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/leads?page=${p}${sp.status ? `&status=${sp.status}` : ""}`}
              className={p === page ? "active" : ""}
            >
              {p}
            </Link>
          ))}
        </nav>
      ) : null}
    </section>
  );
}
