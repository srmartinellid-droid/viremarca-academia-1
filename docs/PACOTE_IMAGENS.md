# Pacote de imagens — Academia Demo VireMarca (direção A · Performance Bruta)

Todas as imagens são **demo**: geradas por IA ou de banco com licença comercial (Unsplash/Pexels).
Proibido: fotos de academia real, Instagram, marcas visíveis (logos em roupas/equipamentos), rostos de pessoas reais sem licença.
Registrar cada arquivo em `docs/CREDITOS_IMAGENS.md` (origem + licença ou "IA — prompt: …").

## Direção fotográfica (vale para todas)
- Fundo escuro/grafite, **luz dura lateral** (rim light), alto contraste, grão leve, levemente dessaturado.
- Movimento real: suor, giz, respiração, esforço. Ângulo baixo ou 3/4. Nada de pose sorrindo para a câmera.
- Paleta da foto: preto, grafite, pele, metal. **Sem verde na foto** — o verde `#C6FF00` é só da interface.
- Diversidade de corpos, idades e gêneros. Roupas lisas e escuras, sem marca.
- Deixar **área de respiro** para texto: no hero, terço esquerdo mais escuro (desktop) e metade inferior mais escura (mobile).

## Entregáveis (nome exato · tamanho · formato)
Formato final: **WebP qualidade ~80**. Peso máx.: hero 350 KB, demais 220 KB.

| Pasta `public/images/` | Arquivo | Tamanho | Cena |
|---|---|---|---|
| hero | hero-01-desktop.webp / hero-01-mobile.webp | 2400×1350 / 1080×1350 | Levantamento terra ou agachamento com barra, atleta de perfil, poeira de giz no ar |
| hero | hero-02-desktop.webp / hero-02-mobile.webp | 2400×1350 / 1080×1350 | Musculação com halteres, luz lateral recortando o músculo |
| hero | hero-03-desktop.webp / hero-03-mobile.webp | 2400×1350 / 1080×1350 | Aula coletiva de funcional/HIIT, grupo em movimento, leve motion blur |
| modalidades | musculacao, funcional, cross-training, hiit, lutas, mobilidade (.webp) | 1200×900 | Uma cena por modalidade, mesma luz e grade de cor |
| estrutura | musculacao, cardio, funcional, box-cross, lutas, vestiario (.webp) | 1600×1067 | Ambientes vazios, arquitetura industrial escura, sem pessoas (ilustrativo) |
| equipe | professor-01…04.webp | 800×1000 | Retrato 3/4 de peito para cima, fundo escuro liso, braços cruzados ou segurando equipamento; pessoas **sintéticas** |
| blog | post-01, post-02, post-03 (.webp) | 1600×900 | 01: ajuste de anilhas na barra · 02: aquecimento com corda · 03: aula coletiva |
| sections | aula-experimental-bg.webp | 2400×1200 | Close de mãos com giz segurando a barra (fundo do bloco "Aula grátis") |
| sections | cta-final-bg.webp | 2400×1200 | Corredor de equipamentos em perspectiva, luz no fim |

## Marca (fictícia) — `public/brand/`
- `logo-light.svg` (para fundo claro) e `logo-dark.svg` (para fundo escuro): wordmark "ACADEMIA DEMO" + monograma. Legível a 120 px de largura.
- `monogram.svg`: símbolo quadrado, legível a 16 px. Original — não pode lembrar marca existente de academia/esporte.
- A partir do monograma: `src/app/icon.svg`, `src/app/favicon.ico` (16/32/48), `src/app/apple-icon.png` (180×180, fundo `#0A0A0B`), `public/icon-192.png`, `public/icon-512.png`, `public/icon-maskable-512.png` (zona segura 80%).
- OG: é gerada por código (`opengraph-image`) com o logo das Configurações — não precisa de PNG estático.

## Aceite
Nomes e tamanhos exatos · pesos dentro do limite · créditos preenchidos · nenhuma marca/rosto real · consistência de cor entre todas as fotos (parecem do mesmo ensaio).
