import { asc } from "drizzle-orm";

import { db } from "@/db";
import { user } from "@/db/schema";
import { requireOwner } from "@/core/auth/guards";
import { deactivateUser } from "./actions";
import { UserForm } from "./Form";

export default async function UsuariosPage() {
  await requireOwner();
  const rows = await db.select().from(user).orderBy(asc(user.name));
  return (
    <section>
      <div className="admin-heading"><div><span>CONTA</span><h1>Usuários</h1>
        <p className="admin-page-hint">Gerencie os usuários do painel e seus níveis de acesso.</p></div></div>
      <UserForm />
      <div className="admin-table">
        {rows.map((item) => (
          <div className="admin-row admin-row-head" key={item.id}>
            <strong>{item.name}</strong>
            <span>{item.email}</span>
            <span>{item.role}</span>
            <span>{item.active ? "Ativo" : "Inativo"}</span>
            {item.active ? (
              <form action={deactivateUser}>
                <input type="hidden" name="id" value={item.id} />
                <button className="admin-danger-button">Desativar</button>
              </form>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
