"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await authClient.requestPasswordReset({ email: String(form.get("email")), redirectTo: window.location.origin + "/admin/resetar-senha" });
    setMessage(result.error ? "Não foi possível iniciar o processo." : "Se o e-mail existir, você receberá as instruções.");
  }
  return <main className="admin-login"><form className="admin-form" onSubmit={submit}><strong>RECUPERAR SENHA</strong><label>E-mail<input name="email" type="email" required /></label><button className="btn">ENVIAR</button>{message ? <p>{message}</p> : null}</form></main>;
}
