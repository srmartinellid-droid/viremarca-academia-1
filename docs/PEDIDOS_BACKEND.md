# Pedidos de backend

## 26/09/2026 · rodada pós-auditoria

1. Adicionar `sanitize-html` e `@types/sanitize-html`. Enquanto isso, `src/lib/sanitize-html.ts` usa allowlist local.
2. Expor em `src/core/auth/actions.ts` `createStaffUser({ name, email, tempPassword })`, gerando hash com Better Auth, role `staff`, `active=true` e `mustChangePassword=true`.
3. TipTap fica para uma rodada posterior. Publicações usam textarea HTML simples e sanitização no servidor.
4. Adicionar `@vercel/blob` e `sharp` ao lockfile. O upload está em `src/core/media/actions.ts` e exige `BLOB_READ_WRITE_TOKEN`.
5. A tabela `media` tem constraint atual de 5 MB. A entrada aceita até 8 MB e é otimizada para WebP; se a saída ultrapassar a constraint, devolver erro legível ou revisar a constraint em migração futura. Não alterar schema nesta rodada.
6. Validar no ambiente com Blob: upload de celular, troca/remoção, limpeza do Blob antigo e bloqueio de exclusão quando a imagem estiver em uso.
