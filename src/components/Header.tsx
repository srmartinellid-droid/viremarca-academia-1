"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type HeaderProps = {
  name: string;
  whatsapp?: string | null;
  whatsappMessage?: string | null;
};

export function Header({ name, whatsapp, whatsappMessage }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const phone = (whatsapp || "").replace(/\D/g, "");
  const whatsappUrl = phone
    ? "https://wa.me/" +
      phone +
      "?text=" +
      encodeURIComponent(whatsappMessage || "Olá! Quero conhecer a academia.")
    : "/aula-experimental";
  const links = [
    ["/modalidades", "Modalidades"],
    ["/horarios", "Horários"],
    ["/planos", "Planos"],
    ["/estrutura", "Estrutura"],
    ["/equipe", "Equipe"],
    ["/blog", "Conteúdo"],
    ["/contato", "Contato"],
  ];

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <header className={"nav " + (scrolled ? "is-scrolled" : "")}>
        <div className="container nav-inner">
          <Link href="/" className="brand" onClick={() => setOpen(false)}>
            {name}
            <b> ●</b>
          </Link>
          <nav className="nav-links" aria-label="Navegação principal">
            {links.map(([href, label]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <a className="btn nav-cta" href={whatsappUrl}>
              AULA GRÁTIS
            </a>
            <button
              className="mobile-toggle"
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(!open)}
            >
              {open ? "FECHAR" : "MENU"}
            </button>
          </div>
        </div>
        {open ? (
          <div id="mobile-menu" className="mobile-drawer">
            <nav className="container mobile-menu-links" aria-label="Menu mobile">
              {links.map(([href, label]) => (
                <Link key={href} href={href} onClick={() => setOpen(false)}>
                  {label}
                </Link>
              ))}
              <a className="btn" href={whatsappUrl}>
                AULA GRÁTIS
              </a>
            </nav>
          </div>
        ) : null}
      </header>
    </>
  );
}
