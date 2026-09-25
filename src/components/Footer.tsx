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
          <p className="muted">
            Performance, força e movimento.
          </p>
        </div>
        <div className="footer-links">
          <Link href="/privacidade">Privacidade</Link>
          <Link href="/contato">Contato</Link>
          {phone && <span>{phone}</span>}
          {email && <span>{email}</span>}
        </div>
        <p className="muted footer-credit">
          © 2026 · Desenvolvido por VireMarca
        </p>
      </div>
    </footer>
  );
}
