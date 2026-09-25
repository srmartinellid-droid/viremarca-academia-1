# Regras para agentes — Academia 1

1. Só este repositório e o Neon `orange-voice-23637148`. Nenhum outro cliente.
2. Trabalhe na branch git `dev`. Sem deploy, sem Vercel, sem Floot. Só a `main` publica (vercel.json).
3. **Commits agrupados** (vários arquivos por commit). Nunca arquivo a arquivo.
4. **Código legível**: formatado com Prettier (`npm run format`). Proibido arquivo minificado/em uma linha.
5. **Não altere sem combinar**: `src/db/**`, `drizzle/**`, `scripts/**`, `src/lib/auth.ts`, `src/core/auth/**`, `src/core/security/**`, `package.json` (dependências). Precisa de coluna/tabela/lib nova? Registre em `docs/PEDIDOS_BACKEND.md` e siga com o resto.
6. Leituras públicas só via `src/lib/queries/public.ts`. Toda Server Action do admin começa com `await assertRole("staff" | "owner")`.
7. Zero secrets no código. Zero dados reais: conteúdo é demo e marcado.
8. Nada de "pronto" sem evidência. O que não foi executado é **NÃO EXECUTADO + motivo**.
