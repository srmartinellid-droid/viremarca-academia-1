# Arquitetura

```src/core -> auth, tema, leads, SEO, mídia, analytics
src/template/academia -> modalidades, horários, planos, professores, aula experimental
src/app -> Next.js App Router
src/db -> Drizzle + Neon```

O navegador nunca acessa o banco diretamente.