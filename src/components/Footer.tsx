import Link from "next/link";

type FooterProps = {
  name: string;
  phone?: string | null;
  email?: string | null;
};

export function Footer({ name, phone, email }: FooterProps) {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <strong>{name}</strong>
          <p className="muted">Performance, força e movimento.</p>
        </div>
        <div className="footer-links">
          <Link href="/privacidade">Privacidade</Link>
          <Link href="/contato">Contato</Link>
          {phone ? <span>{phone}</span> : null}
          {email ? <span>{email}</span> : null}
        </div>
        <p className="muted footer-credit">
          © 2026 {name} · Todos os direitos reservados. ·{" "}
          <a href="https://www.viremarca.com.br" rel="noopener noreferrer">
            Desenvolvido por VireMarca
          </a>
        </p>
      </div>
    </footer>
  );
}
