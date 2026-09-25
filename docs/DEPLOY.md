# Deploy limpo (1 merge = 1 deploy)

1. **Neon production** (`br-wandering-thunder-b5t2hsn4`): criar role `academia_app`; aplicar `drizzle/*.sql` (`npm run db:migrate` com a URL unpooled da production). **Sem seed demo.**
2. `npm run admin:bootstrap` na production com `ADMIN_INITIAL_EMAIL` / `ADMIN_INITIAL_PASSWORD` (troca obrigatória no 1º login).
3. **Vercel Blob**: criar store e copiar `BLOB_READ_WRITE_TOKEN`.
4. **Projeto Vercel** ligado ao repo; `vercel.json` já restringe deploy à `main`.
5. **Envs** (nomes em `.env.example`): `DATABASE_URL` com role `academia_app` (pooled), `BETTER_AUTH_SECRET` (32+ bytes aleatórios), `BETTER_AUTH_URL` e `SITE_URL` = domínio final, `EMAIL_DRIVER=resend` + `RESEND_API_KEY` + `EMAIL_FROM`.
6. Merge do PR `dev → main` (squash) → 1 deploy de Production.
7. Release Gate em produção (`RELEASE_GATE.md`) + `/build-info.json` = SHA.
