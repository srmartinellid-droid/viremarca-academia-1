"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { SignOutButton } from "./SignOutButton";

type Props = { email: string; role: "owner" | "staff" };

const contentLinks = [
  ["/admin/hero", "Hero"], ["/admin/secoes", "Seções"], ["/admin/modalidades", "Modalidades"],
  ["/admin/horarios", "Horários"], ["/admin/planos", "Planos"], ["/admin/equipe", "Equipe"],
  ["/admin/galeria", "Galeria"], ["/admin/publicacoes", "Publicações"], ["/admin/depoimentos", "Depoimentos"],
  ["/admin/faq", "FAQ"], ["/admin/numeros", "Números"], ["/admin/midia", "Mídia"],
] as const;

export function AdminSidebar({ email, role }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const owner = role === "owner";
  const close = () => setOpen(false);
  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const link = (href: string, label: string) => (
    <Link className={active(href) ? "is-active" : ""} href={href} onClick={close} key={href}>{label}</Link>
  );

  return (
    <>
      <button className="admin-menu-button" type="button" onClick={() => setOpen(!open)}>{open ? "Fechar" : "Menu"}</button>
      {open ? <button className="admin-drawer-backdrop" type="button" aria-label="Fechar menu" onClick={close} /> : null}
      <aside className={open ? "admin-sidebar is-open" : "admin-sidebar"}>
        <strong>ACADEMIA DEMO</strong>
        <nav>
          <span>CONVERSÃO</span>{link("/admin", "Dashboard")}{link("/admin/leads", "Leads")}
          <span>CONTEÚDO</span>{contentLinks.map(([href, label]) => link(href, label))}
          <span>CONTA</span>
          {owner ? link("/admin/configuracoes", "Configurações") : null}
          {owner ? link("/admin/usuarios", "Usuários") : null}
          {link("/admin/conta", "Minha conta")}
          <Link href="/" target="_blank" onClick={close}>Ver site ↗</Link>
        </nav>
        <div className="admin-user"><span>{email}</span><SignOutButton /></div>
      </aside>
    </>
  );
}
