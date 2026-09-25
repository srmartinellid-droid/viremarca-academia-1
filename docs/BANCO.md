# Banco de dados — Neon (Academia-1)

| Item                      | Valor                                                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Projeto Neon              | `Academia-1` · `orange-voice-23637148` · aws-us-east-2 · Postgres 18                                                     |
| Branch principal          | `production` · `br-wandering-thunder-b5t2hsn4` — **vazia**; recebe migrations só no dia do deploy                        |
| Branch de desenvolvimento | `dev` · `br-damp-wave-b51zc06y` — migrations + seed demo + owner aplicados em 25/09/2026                                 |
| Role da aplicação         | `academia_app` (DML apenas, sem CREATE no schema) — criado na branch `dev`; criar também na `production` antes do deploy |
| Role de migration         | `neondb_owner`                                                                                                           |

## Estado da branch `dev` (verificado em 25/09/2026)

24 tabelas · 2 migrations registradas em `drizzle.__drizzle_migrations` · 20 triggers de `updated_at` ·
6 modalidades · 21 aulas na grade · 3 planos · 3 posts · owner `tsiseguranca48@gmail.com` com `must_change_password = true`.

## Regras

- Mudança de schema = editar `src/db/schema/*` → `npm run db:generate` → commitar o SQL gerado em `drizzle/`. **Nunca** alterar o banco à mão.
- Migrations e seed só em `dev`. Seed exige `SEED_TARGET=dev` (proteção contra rodar em produção).
- `DATABASE_URL` (pooled) para a app; `DATABASE_URL_UNPOOLED` (sem `-pooler`) para migrations.
- Em produção a app conecta com `academia_app`, nunca com `neondb_owner`.
- O navegador nunca acessa o banco (`src/db/index.ts` é `server-only`).

## Segurança sem RLS

- Toda action/rota do admin chama `assertRole()` (actions) ou `requireStaff()/requireOwner()` (páginas) de `src/core/auth/guards.ts`.
- Leituras públicas sempre filtram `active = true` ou `status = 'published' and published_at <= now()`; centralizar em `src/lib/queries/public.ts`.
- Rate limit persistente: função `public.rate_limit_hit(key, limit, window_s)` + helper `src/core/security/rate-limit.ts` (login 5/15 min, lead 3/10 min).
- `analytics_events.name` tem allowlist por CHECK no banco. `site_settings` é singleton por CHECK.
- Leads guardam `user_agent_hash` (sha256 com salt), nunca IP/UA em texto.

## Tabelas

Auth: `user` (+ role, must_change_password, active), `session`, `account`, `verification`.
Conteúdo: `site_settings`, `opening_exceptions`, `media`, `home_sections`, `hero_slides`, `stats`, `modalities`,
`instructors`, `class_schedule`, `plans`, `gallery_items`, `post_categories`, `posts`, `testimonials`, `faqs`.
Operação: `leads`, `lead_events`, `analytics_events`, `rate_limits`, `audit_log`.
