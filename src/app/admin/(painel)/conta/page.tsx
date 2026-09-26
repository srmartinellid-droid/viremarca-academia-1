import { requireStaff } from "@/core/auth/guards";
import { AccountClient } from "@/components/AccountClient";

export default async function AccountPage() {
  await requireStaff();
  return (
    <section>
      <div className="admin-heading">
        <span>CONTA</span>
        <h1>Conta</h1>
        <p className="admin-page-hint">Gerencie seus dados de acesso e as ações de segurança da sua conta.</p>
      </div>
      <AccountClient />
    </section>
  );
}
