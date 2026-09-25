"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await authClient.signIn.email({ email: String(form.get("email")), password: String(form.get("password")) });
    if (result.error) {
      setMessage(result.error.message || "Credenciais inválidas.");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }
  return <main className="admin-login"><form className="admin-form" onSubmit={submit}><strong>ACESSO ADMINISTRATIVO</strong><label>E-mail<input name="email" type="email" required autoComplete="email" /></label><label>Senha<input name="password" type="password" required autoComplete="current-password" /></label><button className="btn">ENTRAR</button><a href="/admin/esqueci-senha">Esqueci minha senha</a>{message ? <p className="form-error">{message}</p> : null}</form></main>;
}
