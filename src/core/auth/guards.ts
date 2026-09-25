import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type Role = "owner" | "staff";
export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  mustChangePassword: boolean;
};

export class AuthError extends Error {
  constructor(public code: "UNAUTHENTICATED" | "FORBIDDEN" | "MUST_CHANGE_PASSWORD") {
    super(code);
  }
}

/** Lê a sessão atual (ou null). */
export async function getAdminUser(): Promise<AdminUser | null> {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) return null;
  const u = s.user as typeof s.user & {
    role?: Role;
    mustChangePassword?: boolean;
    active?: boolean;
  };
  if (u.active === false) return null;
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role === "owner" ? "owner" : "staff",
    mustChangePassword: Boolean(u.mustChangePassword),
  };
}

/**
 * Para Server Actions e route handlers: lança AuthError (não redireciona).
 * Chame em TODA action do admin — o middleware sozinho não basta.
 */
export async function assertRole(min: Role, opts: { allowPendingPassword?: boolean } = {}) {
  const u = await getAdminUser();
  if (!u) throw new AuthError("UNAUTHENTICATED");
  if (u.mustChangePassword && !opts.allowPendingPassword)
    throw new AuthError("MUST_CHANGE_PASSWORD");
  if (min === "owner" && u.role !== "owner") throw new AuthError("FORBIDDEN");
  return u;
}

/** Para páginas (Server Components): redireciona em vez de lançar. */
export async function requireStaff() {
  const u = await getAdminUser();
  if (!u) redirect("/admin/login");
  if (u.mustChangePassword) redirect("/admin/trocar-senha");
  return u;
}

export async function requireOwner() {
  const u = await requireStaff();
  if (u.role !== "owner") redirect("/admin?erro=sem-permissao");
  return u;
}
