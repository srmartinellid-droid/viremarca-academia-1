"use client";

import Link from "next/link";
import { useState } from "react";
import { SignOutButton } from "./SignOutButton";

type Props = { email: string; role: "owner" | "staff" };

export function AdminSidebar({ email, role }: Props) {
  const [open, setOpen] = useState(false);
  const owner = role === "owner";
  const close = () => setOpen(false);
  const contentLinks = [
    ["/admin/hero", "Hero"],
    ["/admin/secoes", "Seções"],
    ["/admin/modalidades", "Modalidades"],
    ["/admin/horarios", "Horários"],
    ["/admin/planos", "Planos"],
    ["/admin/equipe", "Equipe"],
    ["/admin/publicacoes", "Publicações"],
    ["/admin/depoimentos", "Depoimentos"],
    ["/admin/faq", "FAQ"],
    ["/admin/numeros", "Números"],
  ];

  return (
    <>
      <button className="admin-menu-button" type="button" onClick={() => setOpen(!open)}>
        {open ? "Fechar" : "Menu"}
      </button>
      <aside className={(open ? "admin-sidebar is-open" : "admin-sidebar").trim()}>
        <strong>ACADEMIA DEMO</strong>
        <nav>
          <span>CONVERSÃO</span>
          <Link href="/admin" onClick={close}>Dashboard</Link>
          <Link href="/admin/leads" onClick={close}>Leads</Link>
          <span>CONTEÚDO</span>
          {contentLinks.map(([href, label]) => (
            <Link href={href} onClick={close} key={href}>{label}</Link>
          ))}
          <span>CONTA</span>
          {owner ? <Link href="/admin/configuracoes" onClick={close}>Configurações</Link> : null}
          {owner ? <Link href="/admin/usuarios" onClick={close}>Usuários</Link> : null}
          <Link href="/admin/conta" onClick={close}>Minha conta</Link>
          <Link href="/" target="_blank" onClick={close}>Ver site ↗</Link>
        </nav>
        <div className="admin-user">
          <span>{email}</span>
          <SignOutButton />
        </div>
      </aside>
    </>
  );
}
