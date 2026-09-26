"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { completePasswordChange } from "@/core/auth/actions";

const WEAK = ["12345678", "1234567890", "123456789", "senha1234", "password12"];

export function AccountClient({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const currentPassword = String(form.get("currentPassword"));
    const newPassword = String(form.get("newPassword"));
    const confirm = String(form.get("confirm"));
    if (newPassword !== confirm) return setMessage("A confirmação não confere.");
    if (newPassword.length < 10) return setMessage("Use pelo menos 10 caracteres.");
    if (WEAK.includes(newPassword) || newPassword === currentPassword)
      return setMessage("Escolha uma senha diferente e menos previsível.");

    setBusy(true);
    const result = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });
    if (result.error) {
      setBusy(false);
      return setMessage("Senha atual incorreta ou senha nova inválida.");
    }
    await completePasswordChange();
    setBusy(false);
    setMessage("Senha alterada com sucesso.");
    if (redirectTo) {
      router.replace(redirectTo);
      router.refresh();
    }
  }

  return (
    <form className="admin-form" onSubmit={submit}>
      <label>
        Senha atual
        <input name="currentPassword" type="password" autoComplete="current-password" required />
      </label>
      <label>
        Nova senha (mín. 10 caracteres)
        <input
          name="newPassword"
          type="password"
          autoComplete="new-password"
          minLength={10}
          required
        />
      </label>
      <label>
        Confirme a nova senha
        <input name="confirm" type="password" autoComplete="new-password" minLength={10} required />
      </label>
      <button className="btn" disabled={busy}>
        {busy ? "SALVANDO…" : "SALVAR NOVA SENHA"}
      </button>
      {message ? <p role="status">{message}</p> : null}
    </form>
  );
}
