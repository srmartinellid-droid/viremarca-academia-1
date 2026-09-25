# Decisões

- Projeto: Academia 1 / Template Academia. Direção visual A · Performance Bruta.
- Banco: Neon `orange-voice-23637148` (ver `docs/BANCO.md`). Branch `dev` para desenvolvimento.
- ORM: Drizzle 0.45 + drizzle-kit; migrations SQL versionadas em `drizzle/`.
- Driver: `pg` (node-postgres) em todos os ambientes — funciona com o endpoint pooled do Neon no runtime Node da Vercel e com Postgres local nos testes; suporta transações.
- Auth: Better Auth 1.7 com adapter Drizzle embutido (`better-auth/adapters/drizzle`). Cadastro público desligado. Hash scrypt (padrão Better Auth). Campos `role`, `must_change_password`, `active` no `user`. O pacote separado `@better-auth/drizzle-adapter` foi removido (conflito ERESOLVE).
- Rate limit: tabela `rate_limits` + função SQL atômica. Nunca em memória.
- Fontes auto-hospedadas via `@fontsource` + `next/font/local` (build não depende do Google Fonts; zero requisição externa de fonte).
- Next 15 + React 19 + Tailwind 4 (CSS-first, `@tailwindcss/postcss`).
- Divisão de trabalho (25/09/2026): Claude = banco, auth, segurança, validação/CI; GPT = front-end, admin UI e pacote de imagens, sobre esta base.
