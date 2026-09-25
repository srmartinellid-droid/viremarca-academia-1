# viremarca-academia-1 — Template Academia (VireMarca)

Site + painel administrativo para academias. **Camada: TEMPLATE** (conteúdo 100% demo).

Stack: Next.js 15 (App Router) · TypeScript · Tailwind 4 · Neon Postgres · Drizzle ORM · Better Auth · Vercel.

## Rodar localmente

```bash
nvm use                      # Node 20+
npm ci
cp .env.example .env.local   # preencha DATABASE_URL (branch Neon dev) e BETTER_AUTH_SECRET
npm run db:migrate           # aplica drizzle/*.sql
SEED_TARGET=dev npm run db:seed
ADMIN_INITIAL_EMAIL=... ADMIN_INITIAL_PASSWORD=... npm run admin:bootstrap
npm run dev                  # http://localhost:3000  ·  painel: /admin
```

## Verificações

```bash
npm run lint && npm run typecheck && npm run build
TEST_DATABASE_URL=postgres://.../base_vazia npm test   # testes de banco (Postgres local)
```

Leia antes de alterar: `AGENTS.md`, `docs/BANCO.md`, `docs/DECISOES.md`, `RELEASE_GATE.md`.

© 2026 Academia Demo VireMarca · Todos os direitos reservados. · Desenvolvido por VireMarca
