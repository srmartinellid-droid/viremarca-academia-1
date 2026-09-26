import Link from "next/link";
import { requireStaff } from "@/core/auth/guards";
import { SignOutButton } from "@/components/admin/SignOutButton";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await requireStaff();
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <strong>ACADEMIA DEMO</strong>
        <nav>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/leads">Leads</Link>
          <Link href="/admin/hero">Hero</Link>
          {user.role === "owner" ? <Link href="/admin/configuracoes">Configurações</Link> : null}
          <Link href="/admin/conta">Conta</Link>
          <Link href="/" target="_blank">
            Ver site ↗
          </Link>
        </nav>
        <div className="admin-user">
          <span>{user.email}</span>
          <SignOutButton />
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
