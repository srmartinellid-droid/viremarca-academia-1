import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireStaff } from "@/core/auth/guards";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await requireStaff();
  return (
    <div className="admin-shell">
      <AdminSidebar email={user.email} role={user.role} />
      <main className="admin-main">{children}</main>
    </div>
  );
}
