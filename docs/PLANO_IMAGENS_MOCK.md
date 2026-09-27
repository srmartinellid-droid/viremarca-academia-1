# Plano de imagens mock · Academia 1

## Fase 1 · Auditoria do seed

Li diretamente o arquivo `scripts/seed-data.ts` na branch `dev`. Os caminhos de imagem efetivamente referenciados pelo seed totalizam 24 arquivos físicos, considerando que `modalidades/mobilidade.webp` é compartilhado intencionalmente por Pilates Solo e Mobilidade.

### 24 caminhos exatos

#### Hero
1. `public/images/hero/hero-02-desktop.webp`
2. `public/images/hero/hero-02-mobile.webp`
3. `public/images/hero/hero-03-desktop.webp`
4. `public/images/hero/hero-03-mobile.webp`

#### Modalidades
5. `public/images/modalidades/musculacao.webp`
6. `public/images/modalidades/funcional.webp`
7. `public/images/modalidades/cross-training.webp`
8. `public/images/modalidades/hiit.webp`
9. `public/images/modalidades/lutas.webp`
10. `public/images/modalidades/mobilidade.webp`
11. `public/images/modalidades/spinning.webp`

#### Equipe
12. `public/images/equipe/professor-01.webp`
13. `public/images/equipe/professor-02.webp`
14. `public/images/equipe/professor-03.webp`
15. `public/images/equipe/professor-04.webp`

#### Estrutura
16. `public/images/estrutura/musculacao.webp`
17. `public/images/estrutura/cardio.webp`
18. `public/images/estrutura/funcional.webp`
19. `public/images/estrutura/box-cross.webp`
20. `public/images/estrutura/lutas.webp`
21. `public/images/estrutura/vestiario.webp`

#### Blog
22. `public/images/blog/post-01.webp`
23. `public/images/blog/post-02.webp`
24. `public/images/blog/post-03.webp`

## Conceito visual

Todas as fotos devem parecer parte do mesmo ensaio fotográfico de uma academia fictícia: ambiente industrial contemporâneo, predominância de preto/grafite, metal, concreto e luz lateral controlada, com pequenos acentos verde-limão coerentes com `#C6FF00`. Nenhuma fotografia terá texto, logotipo, marca d'água ou selo DEMO embutido.

### Hero

- `hero-02-desktop.webp`: atleta fictícia ou atleta fictício executando musculação com halteres, enquadramento cinematográfico horizontal, espaço negativo suficiente para a interface sobrepor o título.
- `hero-02-mobile.webp`: mesma situação visual e mesmo ensaio, composição vertical 4:5, priorizando corpo e halteres sem simplesmente esmagar o enquadramento desktop.
- `hero-03-desktop.webp`: grupo fictício em aula coletiva de treino funcional, energia e interação visíveis, enquadramento amplo horizontal com área limpa para texto.
- `hero-03-mobile.webp`: composição vertical da mesma aula e linguagem fotográfica, priorizando um pequeno grupo em ação e mantendo legibilidade do sujeito principal.

### Modalidades

- `modalidades/musculacao.webp`: pessoa fictícia realizando exercício de musculação com halteres, enquadramento 4:3, expressão e postura naturais, equipamento sem marcas.
- `modalidades/funcional.webp`: pessoa fictícia realizando movimento funcional com kettlebell/corda/caixa, sensação de movimento e controle.
- `modalidades/cross-training.webp`: atleta fictício executando movimento composto típico de cross training, ambiente de box, intensidade alta mas tecnicamente plausível.
- `modalidades/hiit.webp`: pessoa fictícia em exercício intervalado intenso, preferência por movimento corporal/cardio, sensação de esforço sem pose artificial.
- `modalidades/lutas.webp`: praticante fictício em treino de Muay Thai, técnica em saco/manopla ou movimento controlado, sem violência gráfica.
- `modalidades/mobilidade.webp`: pessoa fictícia realizando exercício de mobilidade/Pilates solo em ambiente limpo, foco em controle corporal e amplitude.
- `modalidades/spinning.webp`: pessoa fictícia em bike indoor, iluminação dramática e sensação de aula coletiva, sem depender de rostos identificáveis.

### Equipe

- `equipe/professor-01.webp`: retrato vertical de profissional fictício de força, em ambiente da academia, postura profissional e natural.
- `equipe/professor-02.webp`: retrato vertical de profissional fictício de funcional/HIIT, aparência distinta do primeiro e mesma linguagem fotográfica.
- `equipe/professor-03.webp`: retrato vertical de profissional fictício de lutas, aparência distinta e enquadramento editorial.
- `equipe/professor-04.webp`: retrato vertical de profissional fictício de performance/cross training, aparência distinta e iluminação coerente.
Os quatro retratos serão fisicamente diferentes. Os perfis Elisa e Felipe reutilizam os arquivos 01 e 02 conforme o seed, intencionalmente.

### Estrutura

Todos os ambientes serão fotografados vazios, sem pessoas:

- `estrutura/musculacao.webp`: área de musculação completa, racks, bancos e pesos organizados.
- `estrutura/cardio.webp`: área de cardio com esteiras/bikes/elípticos, composição ampla e limpa.
- `estrutura/funcional.webp`: área funcional com piso apropriado, kettlebells, cordas e acessórios.
- `estrutura/box-cross.webp`: box de cross training com rigs, caixas e barras, claramente distinto da área funcional.
- `estrutura/lutas.webp`: espaço de lutas com saco, piso/tatame e equipamentos, sem pessoas.
- `estrutura/vestiario.webp`: vestiário contemporâneo, limpo e vazio, sem pessoas e sem marcas.

### Blog

- `blog/post-01.webp`: fotografia editorial sobre início de rotina de treino, por exemplo mochila/toalha/garrafa e área de treino ao fundo.
- `blog/post-02.webp`: fotografia editorial sobre aquecimento/preparação, com pessoa fictícia aquecendo de forma natural.
- `blog/post-03.webp`: fotografia editorial sobre escolha de modalidade/rotina, composição com elementos de treino e pessoa fictícia em segundo plano.

## Pares homônimos que não podem ser reaproveitados

Os seguintes pares precisam de fotografias fisicamente distintas:

- `modalidades/musculacao.webp` ≠ `estrutura/musculacao.webp`: pessoa em ação versus ambiente vazio.
- `modalidades/funcional.webp` ≠ `estrutura/funcional.webp`: pessoa em ação versus ambiente vazio.
- `modalidades/lutas.webp` ≠ `estrutura/lutas.webp`: praticante em ação versus área de lutas vazia.

`modalidades/mobilidade.webp` é deliberadamente único e compartilhado entre Pilates Solo e Mobilidade pelo seed.

## Decisões / pendências

Não há pendência bloqueante para Daniel ou Claude. A direção visual, o caráter fictício, a composição e as dimensões foram definidos pelo prompt desta tarefa. A única decisão operacional que tomo é manter a fotografia sem qualquer texto ou selo DEMO embutido, deixando a identificação de demonstração para a interface existente.

## Restrições de integração

- Somente `public/images/**` será alterado nesta fase, além deste documento de plano.
- Não alterar seed, banco, autenticação, segurança, package.json ou componentes.
- Não executar seed, build ou deploy.
- Um único commit agrupado na branch `dev` após todas as imagens estarem integradas.
