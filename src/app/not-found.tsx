import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-hero not-found">
      <div className="container prose">
        <span className="eyebrow">404</span>
        <h1>PÁGINA NÃO ENCONTRADA.</h1>
        <p className="muted">O endereço solicitado não existe ou não está publicado.</p>
        <Link className="btn" href="/">
          VOLTAR PARA A HOME
        </Link>
      </div>
    </main>
  );
}
