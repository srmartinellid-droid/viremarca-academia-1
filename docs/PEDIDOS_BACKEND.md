# Pedidos de backend

## 26/09/2026 · rodada pós-auditoria

1. Adicionar `sanitize-html` e `@types/sanitize-html` ao projeto quando o pacote puder entrar no lockfile. Enquanto isso, `src/lib/sanitize-html.ts` usa uma allowlist local de tags e atributos.
2. Expor em `src/core/auth/actions.ts` a action:
   `createStaffUser({ name, email, tempPassword })`
   retornando `{ id: string }`. Ela deve gerar o hash de senha com Better Auth, criar o usuário com role `staff`, `active=true` e `mustChangePassword=true`.
3. O editor rico TipTap fica para uma rodada posterior. Publicações usam textarea HTML simples e sanitização no servidor.
4. Blob/storage ainda não está configurado. A seção Mídia foi removida do menu até a infraestrutura estar disponível.
