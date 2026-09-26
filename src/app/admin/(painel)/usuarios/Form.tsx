"use client";

import { createStaffUser } from "./actions";

export function UserForm() {
  return (
    <form className="admin-form admin-crud-form" action={createStaffUser}>
      <label>Nome<input name="name" required /></label>
      <label>E-mail<input name="email" type="email" required /></label>
      <label>Senha provisória<input name="tempPassword" type="password" minLength={10} required /></label>
      <button className="btn" type="submit">CRIAR STAFF</button>
      <p className="muted">A senha deve ter pelo menos 10 caracteres. O primeiro acesso exige troca.</p>
    </form>
  );
}
