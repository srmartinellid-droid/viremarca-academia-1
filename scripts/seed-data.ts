const img = (p: string) => "/images/" + p;
const now = new Date();
const daysAgo = (n: number) => new Date(now.getTime() - n * 86_400_000);
const H = (open: string, close: string) => [{ open, close }];

const article = (title: string, focus: string) =>
  "<h2>" + title + "</h2>" +
  "<p>Este artigo demonstrativo da Academia Demo VireMarca fala sobre " + focus +
  " e organiza ideias práticas para quem quer construir uma rotina de treino. O objetivo é mostrar como um conteúdo editorial pode orientar o visitante sem promessas médicas, sem garantias de resultado e sem substituir avaliação profissional. Comece observando sua rotina, escolha horários possíveis e use a estrutura da academia como apoio para criar consistência.</p>" +
  "<h2>Como aplicar</h2>" +
  "<p>Antes da sessão, confira a programação, prepare o material necessário e converse com a equipe se houver dúvida sobre execução, carga ou progressão. A técnica deve vir antes da pressa. Uma boa sessão também inclui aquecimento, pausas adequadas e organização do espaço. Registre o que funcionou para transformar uma experiência isolada em um hábito repetível.</p>" +
  "<ul><li>Escolha horários que você consegue repetir.</li><li>Aumente a dificuldade de forma gradual.</li><li>Anote exercícios, séries e percepções.</li><li>Peça orientação quando algo não estiver claro.</li></ul>" +
  "<h2>Uma semana sustentável</h2>" +
  "<p>Consistência nasce de decisões pequenas repetidas muitas vezes. Se uma semana sair do planejado, retome na próxima oportunidade sem transformar um imprevisto em abandono. Use os horários da academia como referência e ajuste a carga de treino à sua experiência, disponibilidade e orientação profissional.</p>" +
  "<h2>Checklist rápido</h2><p>Confirme seu próximo treino antes de sair, registre o que precisa mudar e volte ao plano na próxima sessão. Este texto é exclusivamente demonstrativo.</p>";

const weekdays = [1, 2, 3, 4, 5, 6];
const classTimes = [
  ["06:00", "07:00"],
  ["07:00", "08:00"],
  ["12:00", "12:45"],
  ["18:00", "19:00"],
  ["19:00", "20:00"],
  ["20:00", "21:00"],
];
const classModalities = ["musculacao", "funcional", "cross-training", "hiit", "muay-thai", "pilates-solo", "spinning", "mobilidade"];
const schedule = weekdays.flatMap((weekday, dayIndex) =>
  classTimes.slice(0, weekday === 6 ? 3 : 6).map((time, timeIndex) => ({
    modality: classModalities[(dayIndex + timeIndex) % classModalities.length],
    weekday,
    start: time[0],
    end: time[1],
    room: ["Sala 1", "Sala 2", "Box", "Estúdio"][timeIndex % 4],
  })),
);

export const seedData = {
  settings: {
    id: 1,
    name: "Academia Demo VireMarca",
    slogan: "Treine forte. Evolua de verdade.",
    logoLightUrl: "/brand/logo-light.svg",
    logoDarkUrl: "/brand/logo-dark.svg",
    monogramUrl: "/brand/monogram.svg",
    accentColor: "#C6FF00",
    whatsapp: "+5500000000000",
    whatsappMessage: "Olá! Vim pelo site da Academia Demo e quero saber mais. (DEMO)",
    phone: "(00) 00000-0000",
    email: "contato@exemplo.com",
    address: { street: "Rua Exemplo", number: "000", district: "Bairro Demo", city: "Cidade Demo", state: "SC", zip: "00000-000" },
    mapEmbedUrl: null,
    openingHours: {
      mon: H("05:30", "23:00"), tue: H("05:30", "23:00"), wed: H("05:30", "23:00"),
      thu: H("05:30", "23:00"), fri: H("05:30", "22:00"), sat: H("08:00", "18:00"), sun: H("08:00", "13:00"),
    },
    notice: null,
    social: { instagram: "https://instagram.com/exemplo" },
    legalName: null,
    cnpj: null,
    consentTextVersion: "v1",
    seoTitle: "Academia Demo VireMarca · Treino, força e performance",
    seoDescription: "Template demonstrativo VireMarca com modalidades, horários, planos, conteúdo e aula experimental.",
    seoRegion: "Cidade Demo - SC",
    isDemo: true,
  },
  homeSections: [
    ["hero", null], ["stats", null], ["modalities", "Modalidades"], ["schedule", "Grade de horários"],
    ["plans", "Planos"], ["trial", "Aula experimental grátis"], ["instructors", "Equipe"],
    ["gallery", "Estrutura"], ["posts", "Publicações"], ["testimonials", "Quem treina aqui"],
    ["faq", "Perguntas frequentes"], ["location", "Onde estamos"], ["aggregators", null],
  ].map(([key, title], i) => ({ key: key as string, title, sortOrder: i + 1 })),
  heroSlides: [
    ["Treine como se fosse o dia da prova.", "Estrutura completa, equipe presente e treino com método.", "Agendar aula grátis", "/aula-experimental", "hero-01-desktop.webp", "hero-01-mobile.webp", "Atleta realizando levantamento com barra em ambiente escuro"],
    ["Força que aparece no treino e na rotina.", "Musculação orientada para diferentes níveis de experiência.", "Ver planos", "/planos", "hero-02-desktop.webp", "hero-02-mobile.webp", "Treino de musculação com halteres sob luz lateral"],
    ["Aulas coletivas com energia de verdade.", "Funcional, cross training e HIIT em uma grade clara.", "Ver horários", "/horarios", "hero-03-desktop.webp", "hero-03-mobile.webp", "Grupo em aula de treino funcional"],
  ].map((h, i) => ({ title: h[0], subtitle: h[1], ctaLabel: h[2], ctaHref: h[3], imageDesktopUrl: img("hero/" + h[4]), imageMobileUrl: img("hero/" + h[5]), imageAlt: h[6], sortOrder: i + 1 })),
  stats: [
    { value: "18", suffix: "h", label: "de funcionamento por dia (demo)", sortOrder: 1 },
    { value: "8", suffix: "", label: "modalidades", sortOrder: 2 },
    { value: "45", suffix: "+", label: "aulas na semana (demo)", sortOrder: 3 },
    { value: "1", suffix: "ª", label: "aula experimental", sortOrder: 4 },
  ],
  modalities: [
    ["Musculação", "musculacao", "Força e hipertrofia com orientação.", "todos", 60, "musculacao.webp", "Para quem quer uma base de força e evolução técnica."],
    ["Funcional", "funcional", "Movimentos variados e intensidade ajustável.", "todos", 50, "funcional.webp", "Para quem gosta de treinos dinâmicos e objetivos."],
    ["Cross Training", "cross-training", "Condicionamento, força e movimentos compostos.", "intermediario", 60, "cross-training.webp", "Para quem busca sessões intensas com progressão."],
    ["HIIT", "hiit", "Intervalos curtos com trabalho controlado.", "todos", 40, "hiit.webp", "Para quem prefere treinos rápidos e estruturados."],
    ["Muay Thai", "muay-thai", "Técnica, coordenação e condicionamento.", "iniciante", 60, "lutas.webp", "Para iniciantes e praticantes que querem técnica."],
    ["Pilates Solo", "pilates-solo", "Controle, mobilidade e consciência corporal.", "todos", 50, "mobilidade.webp", "Para quem quer desenvolver controle e movimento."],
    ["Spinning", "spinning", "Aula de bike indoor com diferentes estímulos.", "todos", 45, "spinning.webp", "Para quem gosta de ritmo e treino coletivo."],
    ["Mobilidade", "mobilidade", "Sessão focada em amplitude e qualidade de movimento.", "todos", 45, "mobilidade.webp", "Para qualquer pessoa que queira incluir mobilidade na rotina."],
  ].map((m, i) => ({ name: m[0], slug: m[1], summary: m[2], level: m[3] as "todos" | "iniciante" | "intermediario" | "avancado", durationMin: m[4], imageUrl: img("modalidades/" + m[5]), imageAlt: m[0] + " em ambiente de academia", description: "<p>" + m[6] + "</p><p>A aula é conduzida com demonstração, adaptação de exercícios e progressão compatível com a experiência do aluno. Resultados variam de pessoa para pessoa e não há promessa médica.</p>", sortOrder: i + 1 })),
  instructors: [
    ["Coach Demo Ana", "Coach de força", "Musculação e técnica", "Perfil fictício de demonstração com foco em técnica e progressão.", "professor-01.webp"],
    ["Coach Demo Bruno", "Coach de funcional", "Funcional e HIIT", "Perfil fictício de demonstração voltado a aulas coletivas.", "professor-02.webp"],
    ["Coach Demo Carla", "Coach de lutas", "Muay Thai", "Perfil fictício de demonstração com foco em fundamentos.", "professor-03.webp"],
    ["Coach Demo Diego", "Coach de performance", "Cross Training", "Perfil fictício de demonstração para treinos estruturados.", "professor-04.webp"],
    ["Coach Demo Elisa", "Coach de movimento", "Pilates e mobilidade", "Perfil fictício de demonstração para controle e mobilidade.", "professor-01.webp"],
    ["Coach Demo Felipe", "Coach de bike", "Spinning", "Perfil fictício de demonstração para aulas de bike indoor.", "professor-02.webp"],
  ].map((t, i) => ({ name: t[0], role: t[1], specialties: t[2], bio: t[3], photoUrl: img("equipe/" + t[4]), photoAlt: t[0] + " em retrato sintético", professionalRegistry: "", sortOrder: i + 1 })),
  schedule,
  plans: [
    { name: "Mensal", period: "mensal" as const, priceCents: 14990, installmentsNote: "valores demonstrativos", benefits: ["Musculação livre", "Avaliação inicial", "Acesso ao app demo", "Horários flexíveis"], highlighted: false, badge: null, ctaLabel: "Quero o mensal", sortOrder: 1 },
    { name: "Trimestral", period: "trimestral" as const, priceCents: 12990, installmentsNote: "valores demonstrativos", benefits: ["Tudo do mensal", "Aulas coletivas", "Reavaliação", "Prioridade de agenda", "Conteúdo exclusivo"], highlighted: true, badge: "Mais escolhido", ctaLabel: "Quero o trimestral", sortOrder: 2 },
    { name: "Anual", period: "anual" as const, priceCents: 9990, installmentsNote: "valores demonstrativos", benefits: ["Tudo do trimestral", "Reavaliações", "Todas as modalidades", "Benefício anual demo"], highlighted: false, badge: null, ctaLabel: "Quero o anual", sortOrder: 3 },
    { name: "Diária", period: "avulso" as const, priceCents: 3900, installmentsNote: "valores demonstrativos", benefits: ["Acesso diário", "Musculação", "Aulas selecionadas", "Sem fidelidade"], highlighted: false, badge: null, ctaLabel: "Quero a diária", sortOrder: 4 },
  ],
  gallery: [
    ["Musculação", "estrutura/musculacao.webp"], ["Cardio", "estrutura/cardio.webp"], ["Funcional", "estrutura/funcional.webp"],
    ["Box Cross", "estrutura/box-cross.webp"], ["Lutas", "estrutura/lutas.webp"], ["Vestiário", "estrutura/vestiario.webp"],
  ].map((g, i) => ({ area: g[0], imageUrl: img(g[1]), imageAlt: "Ambiente demo de " + g[0], caption: "Imagem ilustrativa · demo", isIllustration: true, sortOrder: i + 1 })),
  categories: [{ name: "Treino", slug: "treino" }, { name: "Nutrição", slug: "nutricao" }, { name: "Novidades", slug: "novidades" }],
  posts: [
    ["Como organizar a primeira semana de treino", "primeira-semana-de-treino", "Um guia editorial para começar com consistência.", "post-01.webp", 14],
    ["Aquecimento: o que colocar nos primeiros minutos", "aquecimento-primeiros-minutos", "Uma leitura prática sobre preparação para a sessão.", "post-02.webp", 11],
    ["Como escolher uma modalidade para sua rotina", "escolher-uma-modalidade", "Critérios simples para comparar aulas.", "post-03.webp", 9],
    ["Carga, técnica e progressão: onde começar", "carga-tecnica-progressao", "Como organizar decisões de treino.", "post-01.webp", 7],
    ["Treino coletivo: como aproveitar melhor a aula", "treino-coletivo", "Dicas para chegar preparado e acompanhar a sessão.", "post-02.webp", 4],
    ["Uma rotina que cabe na semana", "rotina-que-cabe-na-semana", "Como transformar intenção em agenda.", "post-03.webp", 2],
  ].map((p, i) => ({ title: p[0], slug: p[1], excerpt: p[2], coverUrl: img("blog/" + p[3]), coverAlt: p[0], tags: ["demo", "academia"], status: "published" as const, publishedAt: daysAgo(p[4]), featured: i === 0, contentHtml: article(p[0], p[2]), seoTitle: p[0], seoDescription: p[2] })),
  testimonials: [
    ["Marina A.", "Musculação", "Gostei da organização dos horários e da clareza para escolher a aula."],
    ["Rafael B.", "Funcional", "A aula demonstrativa deixou claro o que esperar antes de começar."],
    ["Camila C.", "Spinning", "O site facilita comparar modalidades sem ficar procurando informação."],
    ["Diego D.", "Cross Training", "A grade ajuda a encaixar o treino na semana de trabalho."],
    ["Joana E.", "Mobilidade", "Gostei de encontrar duração e nível de cada modalidade."],
    ["Lucas F.", "HIIT", "A proposta da aula aparece de forma objetiva."],
    ["Paula G.", "Muay Thai", "O conteúdo explica o básico sem prometer resultado mágico."],
    ["Bruno H.", "Pilates Solo", "As informações são diretas e fáceis de consultar."],
  ].map((t, i) => ({ authorName: t[0], authorInfo: t[1], quote: t[2], rating: 5, isDemo: true, active: true, sortOrder: i + 1 })),
  faqs: [
    ["A primeira aula é grátis?", "Sim. No template, a primeira aula é uma experiência demonstrativa e deve ser confirmada pela equipe."],
    ["Preciso marcar horário?", "Recomendamos agendar para que a equipe possa orientar sua chegada."],
    ["Quais modalidades estão disponíveis?", "O template apresenta oito modalidades, todas editáveis pelo painel."],
    ["Como escolho o melhor horário?", "Consulte a grade e escolha uma faixa compatível com sua rotina."],
    ["Os preços são reais?", "Não. Todos os valores desta demonstração são fictícios."],
    ["Posso trocar de modalidade?", "A política deve ser definida pela academia real. Este conteúdo é apenas demonstrativo."],
    ["Há planos trimestral e anual?", "Sim, o seed demonstra mensal, trimestral, anual e diária."],
    ["O conteúdo do blog é real?", "Não. Os seis artigos são conteúdo editorial fictício para demonstração."],
    ["A equipe é real?", "Não. Os nomes e perfis são sintéticos e marcados como demonstração."],
    ["Como falar com a academia?", "Use o formulário de aula experimental ou o WhatsApp demonstrativo."],
  ].map((f, i) => ({ question: f[0], answer: f[1], sortOrder: i + 1 })),
};
