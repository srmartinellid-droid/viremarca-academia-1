"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = params.get("token");
    if (!token) {
      setMessage("Token ausente ou inválido.");
      return;
    }
    const form = new FormData(event.currentTarget);
    const result = await authClient.resetPassword({
      newPassword: String(form.get("newPassword")),
      token,
    });
    if (result.error) {
      setMessage(result.error.message || "Não foi possível redefinir.");
      return;
    }
    setMessage("Senha redefinida.");
    router.replace("/admin/login");
  }
  return (
    <main className="admin-login">
      <form className="admin-form" onSubmit={submit}>
        <strong>NOVA SENHA</strong>
        <label>
          Nova senha
          <input name="newPassword" type="password" minLength={10} required />
        </label>
        <button className="btn">REDEFINIR</button>
        {message ? <p>{message}</p> : null}
      </form>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
