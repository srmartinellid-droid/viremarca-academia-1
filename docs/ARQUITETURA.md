# Arquitetura

```
src/
  app/                  Next.js App Router (páginas públicas, /admin, /api)
  core/                 candidatos ao futuro viremarca-core
    auth/guards.ts      requireStaff/requireOwner/assertRole
    security/           rate limit, hash
    email/              driver console/resend
    theme/              tokens e fontes
  template/academia/    específico de academia (modalidades, horários, planos, equipe, aula experimental)
  db/
    schema/             auth.ts · content.ts · ops.ts
    index.ts            cliente server-only
  lib/
    auth.ts             Better Auth
    queries/public.ts   ÚNICO lugar das leituras públicas (filtros active/published)
drizzle/                migrations SQL versionadas
scripts/                migrate, seed (demo), reset-dev, admin-bootstrap
tests/                  integração de banco (vitest)
```

Fluxo: navegador → Server Component / Server Action / route handler → guards → Drizzle → Neon. O navegador nunca acessa o banco.
