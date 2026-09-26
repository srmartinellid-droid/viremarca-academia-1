import { desc } from "drizzle-orm";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { assertRole, AuthError } from "@/core/auth/guards";

export const dynamic = "force-dynamic";

const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

export async function GET() {
  try {
    await assertRole("staff");
  } catch (e) {
    if (e instanceof AuthError) return new Response("Não autorizado", { status: 401 });
    throw e;
  }
  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(5000);
  const header = ["data", "nome", "whatsapp", "email", "origem", "status", "periodo", "notas"];
  const lines = rows.map((r) =>
    [
      r.createdAt.toISOString(),
      r.name,
      r.phone,
      r.email,
      r.source,
      r.status,
      r.preferredTime,
      r.notes,
    ]
      .map(esc)
      .join(","),
  );
  return new Response("﻿" + [header.join(","), ...lines].join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
