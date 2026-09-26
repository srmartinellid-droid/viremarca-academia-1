import { redirect } from "next/navigation";
import { getAdminUser } from "@/core/auth/guards";
import { AccountClient } from "@/components/AccountClient";

export const dynamic = "force-dynamic";

export default async function ChangePasswordPage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return (
    <main className="admin-login">
      <div className="admin-form">
        <strong>DEFINA UMA NOVA SENHA</strong>
        <p className="muted">
          {user.mustChangePassword
            ? "Por segurança, troque a senha provisória antes de acessar o painel."
            : "Altere sua senha de acesso."}
        </p>
        <AccountClient redirectTo="/admin" />
      </div>
    </main>
  );
}
