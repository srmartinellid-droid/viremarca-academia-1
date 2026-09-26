import Link from "next/link";

import { assetExists } from "@/lib/assets";
import { SmartImage } from "@/components/SmartImage";
import { CountUp } from "@/components/CountUp";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { Marquee } from "@/components/Marquee";
import { OpeningStatus } from "@/components/OpeningStatus";
import { Reveal } from "@/core/motion/Reveal";
import { ScheduleGrid } from "@/components/ScheduleGrid";
import { TrackLink } from "@/components/TrackLink";
import { getPublicData, homeMetadata } from "@/lib/queries/public";

export const revalidate = 300;

export async function generateMetadata() {
  const { settings } = await getPublicData();
  return homeMetadata(settings);
}

export default async function Home() {
  const data = await getPublicData();
  const settings = data.settings;
  const scheduleItems = data.schedule.map((item) => ({
    id: item.id,
    weekday: item.weekday,
    startsAt: item.startsAt,
    endsAt: item.endsAt,
    room: item.room,
    modalityName:
      data.modalities.find((modality) => modality.id === item.modalityId)?.name || "Aula",
  }));

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(gymJsonLd(data)).replace(/</g, "\\u003c"),
        }}
      />
      {data.sections.map((section) => {
        if (section.key === "hero") return <HeroSlideshow key={section.key} slides={data.hero} />;
        if (section.key === "stats")
          return (
            <div key={section.key}>
              <Marquee />
              <section className="section alt">
                <div className="container">
                  <Reveal><span className="eyebrow">NÚMEROS</span><h2>RESULTADO SE MEDE.</h2></Reveal>
                  <div className="grid grid-4 stats-grid">
                    {data.stats.map((item) => (
                      <article className="card stat-card" key={item.id} data-reveal="up">
                        <strong><CountUp value={item.value} suffix={item.suffix} /></strong>
                        <span>{item.label}</span>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          );
        if (section.key === "modalities")
          return (
            <section className="section" key={section.key}>
              <div className="container">
                <Reveal><span className="eyebrow">MÉTODO</span><h2>TREINO PARA VIDA REAL.</h2></Reveal>
                <div className="grid grid-3">
                  {data.modalities.map((item) => (
                    <Link href={"/modalidades/" + item.slug} className="card modality-card" key={item.id} data-reveal="up">
                      <SmartImage className="media" src={item.imageUrl} alt={item.imageAlt || item.name} section={item.name} sizes="(max-width: 800px) 100vw, 33vw" />
                      <div className="chip-row"><span className="chip">{item.level}</span><span className="chip">{item.durationMin || 60} min</span></div>
                      <h3>{item.name}</h3>
                      <p className="muted">{item.summary || item.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        if (section.key === "schedule")
          return (
            <section className="section alt" key={section.key}>
              <div className="container">
                <Reveal><span className="eyebrow">GRADE</span><h2>ESCOLHA SEU HORÁRIO.</h2></Reveal>
                <ScheduleGrid items={scheduleItems} compact />
              </div>
            </section>
          );
        if (section.key === "plans")
          return (
            <section className="section" key={section.key}>
              <div className="container">
                <Reveal><span className="eyebrow">INVESTIMENTO</span><h2>ENTRE NO JOGO.</h2></Reveal>
                <div className="grid grid-4">
                  {data.plans.map((item) => (
                    <article className={"card plan-card " + (item.highlighted ? "featured" : "")} key={item.id}>
                      {item.badge ? <span className="demo-badge">{item.badge}</span> : null}
                      <h3>{item.name}</h3>
                      <div className="price"><small>R$</small>{(item.priceCents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}<span>/{item.period}</span></div>
                      <ul>{item.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>
                      <p className="muted demo-note">valores demonstrativos</p>
                      <TrackLink className="btn" href="/aula-experimental" name="plan_click" props={{ plan: item.name }}>{item.ctaLabel || "QUERO ESTE PLANO"}</TrackLink>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          );
        if (section.key === "trial")
          return (
            <section className="section trial-section" id="trial" key={section.key}>
              <div className="container trial-content">
                <Reveal><span className="eyebrow">AULA EXPERIMENTAL</span><h2>PRIMEIRO TREINO. SEM DESCULPA.</h2><p>Preencha o formulário e receba o próximo passo no WhatsApp.</p><Link className="btn" href="/aula-experimental">QUERO MINHA AULA</Link></Reveal>
              </div>
            </section>
          );
        if (section.key === "instructors" || section.key === "team")
          return (
            <section className="section alt" key={section.key}>
              <div className="container">
                <Reveal><span className="eyebrow">EQUIPE</span><h2>QUEM PUXA O TREINO.</h2></Reveal>
                <div className="grid grid-3">
                  {data.instructors.map((item) => (
                    <article className="card" key={item.id}>
                      <SmartImage className="media tall" src={item.photoUrl} alt={item.photoAlt || item.name} section={item.name} sizes="(max-width: 800px) 100vw, 33vw" />
                      <h3>{item.name}</h3><p className="muted">{item.specialties}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          );
        if (section.key === "gallery" || section.key === "structure")
          return (
            <section className="section" key={section.key}>
              <div className="container">
                <Reveal><span className="eyebrow">ESTRUTURA</span><h2>UM AMBIENTE FEITO PARA TREINAR.</h2></Reveal>
                <GalleryLightbox items={data.gallery.map((g) => ({ ...g, hasImage: assetExists(g.imageUrl) }))} />
              </div>
            </section>
          );
        if (section.key === "posts" || section.key === "blog")
          return (
            <section className="section alt" key={section.key}>
              <div className="container">
                <Reveal><span className="eyebrow">CONTEÚDO</span><h2>TREINE TAMBÉM FORA DA ACADEMIA.</h2></Reveal>
                <div className="grid grid-3">
                  {data.posts.map((post) => (
                    <Link className="card" href={"/blog/" + post.slug} key={post.id}>
                      <SmartImage className="media" src={post.coverUrl} alt={post.coverAlt || post.title} section={post.title} sizes="(max-width: 800px) 100vw, 33vw" />
                      <h3>{post.title}</h3><p className="muted">{post.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        if (section.key === "testimonials")
          return (
            <section className="section" key={section.key}>
              <div className="container">
                <Reveal><span className="eyebrow">QUEM TREINA</span><h2>QUEM TREINA, RECOMENDA.</h2></Reveal>
                <div className="grid grid-3">
                  {data.testimonials.map((item) => (
                    <article className="card" key={item.id}><span className="demo-badge">Demo</span><p>“{item.quote}”</p><strong>{item.authorName}</strong><p className="muted">{item.authorInfo}</p></article>
                  ))}
                </div>
              </div>
            </section>
          );
        if (section.key === "faq")
          return (
            <section className="section alt" key={section.key}>
              <div className="container">
                <Reveal><span className="eyebrow">DÚVIDAS</span><h2>SEM ENROLAÇÃO.</h2></Reveal>
                <div className="prose">{data.faqs.map((item) => <details className="faq" key={item.id}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
              </div>
            </section>
          );
        if (section.key === "location")
          return (
            <section className="section" key={section.key}>
              <div className="container prose">
                <Reveal><span className="eyebrow">ONDE ESTAMOS</span><h2>VENHA TREINAR.</h2></Reveal>
                <p>{formatAddress(settings?.address)}</p>
                <OpeningStatus hours={settings?.openingHours} exceptions={data.openingExceptions} />
                <Link className="btn secondary" href="/contato">COMO CHEGAR</Link>
              </div>
            </section>
          );
        return null;
      })}
    </main>
  );
}

function gymJsonLd(data: Awaited<ReturnType<typeof getPublicData>>) {
  const s = data.settings;
  const base = process.env.SITE_URL || "https://viremarca-academia-1.vercel.app";
  const dayMap = { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday" };
  const openingHoursSpecification = Object.entries(s?.openingHours ?? {}).flatMap(([day, slots]) =>
    (slots ?? []).map((slot) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: dayMap[day as keyof typeof dayMap],
      opens: slot.open,
      closes: slot.close,
    })),
  );
  return [
    {
      "@context": "https://schema.org",
      "@type": "ExerciseGym",
      name: s?.name,
      description: s?.seoDescription,
      url: base,
      image: base + "/opengraph-image",
      telephone: s?.phone || undefined,
      email: s?.email || undefined,
      openingHoursSpecification,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: data.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ];
}

function formatAddress(address: unknown) {
  if (!address || typeof address !== "object") return "Endereço disponível em breve.";
  const value = address as { street?: string; number?: string; district?: string; city?: string; state?: string };
  return [value.street && value.number ? value.street + ", " + value.number : value.street, value.district, value.city, value.state].filter(Boolean).join(" · ") || "Endereço disponível em breve.";
}
