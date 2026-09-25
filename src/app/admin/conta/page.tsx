import { requireStaff } from "@/core/auth/guards";
import { AccountClient } from "@/components/AccountClient";

export default async function AccountPage() {
  await requireStaff();
  return <section><div className="admin-heading"><span>SEGURANÇA</span><h1>Conta</h1></div><AccountClient /></section>;
}
