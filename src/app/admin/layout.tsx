import Link from "next/link";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <strong>ACADEMIA DEMO</strong>
        <nav>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/leads">Leads</Link>
          <Link href="/admin/hero">Hero</Link>
          <Link href="/admin/configuracoes">Configurações</Link>
          <Link href="/admin/midia">Mídia</Link>
          <Link href="/admin/conta">Conta</Link>
        </nav>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
