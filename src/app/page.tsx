import Link from "next/link";

import { ScheduleGrid } from "@/components/ScheduleGrid";
import { SmartImage } from "@/components/SmartImage";
import { getPublicData, publicMetadata } from "@/lib/queries/public";

export const revalidate = 300;

export async function generateMetadata() {
  const { settings } = await getPublicData();

  return publicMetadata(
    settings,
    "Academia",
    "Performance, força e movimento.",
  );
}

export default async function Home() {
  const data = await getPublicData();
  const settings = data.settings;
  const hero = data.hero[0];
  const name = settings?.name || "Academia";
  const phone = (settings?.whatsapp || "").replace(/\D/g, "");
  const whatsapp = phone
    ? `https://wa.me/${phone}${
        settings?.whatsappMessage
          ? `?text=${encodeURIComponent(settings.whatsappMessage)}`
          : ""
      }`
    : "/aula-experimental";

  const scheduleItems = data.schedule.map((item) => ({
    id: item.id,
    weekday: item.weekday,
    startsAt: item.startsAt,
    endsAt: item.endsAt,
    room: item.room,
    modalityName:
      data.modalities.find((modality) => modality.id === item.modalityId)?.name ||
      "Aula",
  }));

  const renderSection = (key: string, index: number) => {
    switch (key) {
      case "hero":
        return (
          <section className="hero" key={key}>
            <div className="hero-bg">
              {hero?.imageDesktopUrl && (
                <SmartImage
                  src={hero.imageDesktopUrl}
                  alt={hero.imageAlt}
                  section="Hero"
                  className="hero-media"
                  sizes="100vw"
                />
              )}
            </div>
            <div className="container hero-content">
              <span className="eyebrow">
                {settings?.slogan || "Performance Bruta"}
              </span>
              <h1>
                {hero?.title || "TREINE COMO SE FOSSE O DIA DA PROVA."}
              </h1>
              <p>
                {hero?.subtitle ||
                  "Treino, estrutura e acompanhamento para quem quer transformar esforço em performance."}
              </p>
              <div className="actions">
                <a className="btn" href={hero?.ctaHref || "#trial"}>
                  {hero?.ctaLabel || "QUERO TREINAR"}
                </a>
                <Link className="btn secondary" href="/planos">
                  VER PLANOS
                </Link>
              </div>
            </div>
          </section>
        );

      case "stats":
        return data.stats.length > 0 ? (
          <section className="section alt" key={key}>
            <div className="container">
              <SectionHead eyebrow="NÚMEROS" title="RESULTADO SE MEDE." />
              <div className="grid grid-4">
                {data.stats.map((item) => (
                  <article className="card" key={item.id}>
                    <div className="stat">
                      {item.value}
                      <small>{item.suffix}</small>
                    </div>
                    <p className="muted">{item.label}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null;

      case "modalities":
        return (
          <section className="section" key={key}>
            <div className="container">
              <SectionHead eyebrow="MÉTODO" title="TREINO PARA VIDA REAL." />
              <div className="grid grid-3">
                {data.modalities.slice(0, 6).map((item) => (
                  <Link
                    href={`/modalidades/${item.slug}`}
                    className="card"
                    key={item.id}
                  >
                    <SmartImage
                      src={item.imageUrl}
                      alt={item.imageAlt || item.name}
                      section={item.name}
                      className="media"
                    />
                    <h3>{item.name}</h3>
                    <p className="muted">
                      {item.summary || item.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );

      case "schedule":
        return (
          <section className="section alt" key={key}>
            <div className="container">
              <SectionHead eyebrow="GRADE" title="ESCOLHA SEU HORÁRIO." />
              <ScheduleGrid items={scheduleItems} compact />
              <div className="actions">
                <Link className="btn secondary" href="/horarios">
                  VER GRADE COMPLETA
                </Link>
              </div>
            </div>
          </section>
        );

      case "plans":
        return (
          <section className="section" key={key}>
            <div className="container">
              <SectionHead eyebrow="PLANOS" title="ENTRE NO JOGO." />
              <div className="grid grid-3">
                {data.plans.map((item) => (
                  <article className="card" key={item.id}>
                    <span className="eyebrow">
                      {item.badge || item.period}
                    </span>
                    <h3>{item.name}</h3>
                    <div className="price">
                      R 
                      {(item.priceCents / 100).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                      <small>/mês</small>
                    </div>
                    <ul>
                      {(item.benefits || []).slice(0, 5).map((benefit) => (
                        <li key={benefit}>{benefit}</li>
                      ))}
                    </ul>
                    <a className="btn" href="#trial">
                      {item.ctaLabel || "QUERO ESTE PLANO"}
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </section>
        );

      case "instructors":
      case "team":
        return (
          <section className="section alt" key={key}>
            <div className="container">
              <SectionHead eyebrow="EQUIPE" title="QUEM PUXA O TREINO." />
              <div className="grid grid-4">
                {data.instructors.map((item) => (
                  <article className="card" key={item.id}>
                    <SmartImage
                      src={item.photoUrl}
                      alt={item.photoAlt || item.name}
                      section={item.name}
                      className="media tall"
                    />
                    <h3>{item.name}</h3>
                    <p className="muted">{item.role}</p>
                  </article>
                ))}
              </div>
              <div className="actions">
                <Link className="btn secondary" href="/equipe">
                  CONHEÇA A EQUIPE
                </Link>
              </div>
            </div>
          </section>
        );

      case "gallery":
      case "structure":
        return (
          <section className="section" key={key}>
            <div className="container">
              <SectionHead
                eyebrow="ESTRUTURA"
                title="UM AMBIENTE FEITO PARA TREINAR."
              />
              <div className="grid grid-3">
                {data.gallery.slice(0, 6).map((item) => (
                  <article key={item.id}>
                    <SmartImage
                      src={item.imageUrl}
                      alt={item.imageAlt}
                      section={item.area}
                      className="media"
                    />
                    <p className="muted">{item.caption || item.area}</p>
                  </article>
                ))}
              </div>
              <div className="actions">
                <Link className="btn secondary" href="/estrutura">
                  VER ESTRUTURA
                </Link>
              </div>
            </div>
          </section>
        );

      case "posts":
      case "blog":
        return data.posts.length > 0 ? (
          <section className="section alt" key={key}>
            <div className="container">
              <SectionHead
                eyebrow="CONTEÚDO"
                title="TREINE TAMBÉM FORA DA ACADEMIA."
              />
              <div className="grid grid-3">
                {data.posts.map((item) => (
                  <Link
                    href={`/blog/${item.slug}`}
                    className="card"
                    key={item.id}
                  >
                    <SmartImage
                      src={item.coverUrl}
                      alt={item.coverAlt || item.title}
                      section="Blog"
                      className="media"
                    />
                    <h3>{item.title}</h3>
                    <p className="muted">{item.excerpt}</p>
                  </Link>
                ))}
              </div>
              <div className="actions">
                <Link className="btn secondary" href="/blog">
                  VER TODOS
                </Link>
              </div>
            </div>
          </section>
        ) : null;

      case "testimonials":
        return data.testimonials.length > 0 ? (
          <section className="section" key={key}>
            <div className="container">
              <SectionHead
                eyebrow="QUEM TREINA"
                title="EXPERIÊNCIAS REAIS."
              />
              <div className="grid grid-3">
                {data.testimonials.map((item) => (
                  <article className="card" key={item.id}>
                    {item.isDemo && <span className="demo-badge">Demo</span>}
                    <p>“{item.quote}”</p>
                    <strong>{item.authorName}</strong>
                    <p className="muted">{item.authorInfo}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null;

      case "faq":
        return (
          <section className="section alt" key={key}>
            <div className="container">
              <SectionHead eyebrow="DÚVIDAS" title="SEM ENROLAÇÃO." />
              <div className="prose">
                {data.faqs.slice(0, 8).map((item) => (
                  <details className="faq" key={item.id}>
                    <summary>{item.question}</summary>
                    <p className="muted">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        );

      case "location":
        return (
          <section className="section" key={key}>
            <div className="container prose">
              <SectionHead eyebrow="ONDE ESTAMOS" title="VENHA TREINAR." />
              <p className="muted">
                {formatAddress(settings?.address)}
              </p>
              {settings?.mapEmbedUrl && (
                <a
                  className="btn secondary"
                  href={settings.mapEmbedUrl}
                  rel="noreferrer"
                >
                  COMO CHEGAR
                </a>
              )}
            </div>
          </section>
        );

      case "aggregators":
        return (
          <section className="section alt" key={key}>
            <div className="container prose">
              <SectionHead eyebrow="PARCERIAS" title="ACESSO FACILITADO." />
              <div className="actions">
                {settings?.wellhubEnabled && settings.wellhubUrl && (
                  <a className="btn secondary" href={settings.wellhubUrl}>
                    WELLHUB
                  </a>
                )}
                {settings?.totalpassEnabled && settings.totalpassUrl && (
                  <a className="btn secondary" href={settings.totalpassUrl}>
                    TOTALPASS
                  </a>
                )}
              </div>
            </div>
          </section>
        );

      case "trial":
        return (
          <section className="section" id="trial" key={key}>
            <div className="container">
              <span className="eyebrow">AULA EXPERIMENTAL</span>
              <h2>PRIMEIRO TREINO. SEM DESCULPA.</h2>
              <p className="muted">
                Escolha um horário e fale com nossa equipe.
              </p>
              <div className="actions">
                <a className="btn" href={whatsapp}>
                  AGENDAR AULA
                </a>
                <Link className="btn secondary" href="/contato">
                  CONTATO
                </Link>
              </div>
            </div>
          </section>
        );

      default:
        return (
          <section className="section" key={`${key}-${index}`}>
            <div className="container">
              <p className="muted">Seção configurada: {key}</p>
            </div>
          </section>
        );
    }
  };

  return (
    <main>
      {data.sections.map((section, index) =>
        renderSection(section.key, index),
      )}
    </main>
  );
}

function SectionHead({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="section-head">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
    </div>
  );
}

function formatAddress(address: unknown) {
  if (!address || typeof address !== "object") {
    return "Endereço disponível em breve.";
  }

  const value = address as {
    street?: string;
    number?: string;
    district?: string;
    city?: string;
    state?: string;
  };

  return [
    value.street && value.number
      ? `${value.street}, ${value.number}`
      : value.street,
    value.district,
    value.city,
    value.state,
  ]
    .filter(Boolean)
    .join(" · ") || "Endereço disponível em breve.";
}
