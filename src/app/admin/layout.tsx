import { headers } from "next/headers";
import Link from "next/link";
import { requireStaff } from "@/core/auth/guards";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = (await headers()).get("next-url") || "";
  const publicAuthRoute = pathname === "/admin/login" || pathname === "/admin/esqueci-senha" || pathname === "/admin/resetar-senha";
  if (publicAuthRoute) return <>{children}</>;
  const user = await requireStaff();
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <strong>ACADEMIA DEMO</strong>
        <span>{user.name}</span>
        <nav>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/leads">Leads</Link>
          <Link href="/admin/hero">Hero</Link>
          <Link href="/admin/configuracoes">Configurações</Link>
          <Link href="/admin/conta">Conta</Link>
        </nav>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
