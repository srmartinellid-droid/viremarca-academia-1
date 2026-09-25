"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { completePasswordChange } from "@/core/auth/actions";

export function AccountClient() {
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await authClient.changePassword({
      currentPassword: String(form.get("currentPassword")),
      newPassword: String(form.get("newPassword")),
      revokeOtherSessions: true,
    });
    if (result.error) {
      setMessage(result.error.message || "Não foi possível alterar a senha.");
      return;
    }
    await completePasswordChange();
    setMessage("Senha alterada.");
  }
  return <form className="admin-form" onSubmit={submit}><label>Senha atual<input name="currentPassword" type="password" required /></label><label>Nova senha<input name="newPassword" type="password" minLength={10} required /></label><button className="btn">ALTERAR SENHA</button>{message ? <p>{message}</p> : null}</form>;
}
