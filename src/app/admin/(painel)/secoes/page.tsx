import { asc } from "drizzle-orm";

import { db } from "@/db";
import { homeSections } from "@/db/schema";
import { requireStaff } from "@/core/auth/guards";
import { SectionForm } from "./Form";

export default async function SecoesPage() {
  await requireStaff();
  const rows = await db.select().from(homeSections).orderBy(asc(homeSections.sortOrder));
  return (
    <section>
      <div className="admin-heading"><div><span>CONTEÚDO</span><h1>Seções da home</h1>
        <p className="admin-page-hint">Define quais blocos aparecem na home e em que ordem.</p></div></div>
      <div className="admin-table">
        {rows.map((row) => (
          <div className="admin-row admin-section-row" key={row.key}>
            <strong title={row.key}>{row.title || row.key}</strong><SectionForm section={row as unknown as Record<string, unknown>} />
          </div>
        ))}
      </div>
    </section>
  );
}
