"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Slide = {
  id: string;
  title: string;
  subtitle: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  imageDesktopUrl: string | null;
  imageMobileUrl: string | null;
  imageAlt: string;
};

function demoHeroFallback(src?: string | null) {
  return src?.includes("hero-03") ? "/images/demo/funcional.svg" : "/images/demo/musculacao.svg";
}

export function HeroSlideshow({ slides }: { slides: Slide[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const safeSlides = useMemo(() => slides.filter(Boolean), [slides]);

  useEffect(() => {
    if (safeSlides.length < 2 || paused) return;
    interval.current = setInterval(() => {
      setActive((current) => (current + 1) % safeSlides.length);
    }, 6000);
    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [paused, safeSlides.length]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  if (!safeSlides.length) {
    return (
      <section className="hero hero-fallback" aria-labelledby="hero-title">
        <div className="container hero-content">
          <span className="eyebrow">PERFORMANCE BRUTA</span>
          <h1 id="hero-title">TREINE COMO SE FOSSE O DIA DA PROVA.</h1>
          <p>Estrutura, método e equipe para transformar treino em rotina.</p>
          <Link className="btn" href="/aula-experimental">AULA EXPERIMENTAL</Link>
        </div>
      </section>
    );
  }

  const slide = safeSlides[active];
  return (
    <section
      className="hero"
      aria-roledescription="carrossel"
      aria-label="Destaques da academia"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="hero-slides" aria-live="polite">
        {safeSlides.map((item, index) => {
          const desktopFallback = demoHeroFallback(item.imageDesktopUrl);
          const mobileFallback = demoHeroFallback(item.imageMobileUrl || item.imageDesktopUrl);
          return (
            <div className={"hero-slide " + (index === active ? "is-active" : "")} key={item.id}>
              {item.imageDesktopUrl ? (
                <Image
                  src={item.imageDesktopUrl}
                  alt={item.imageAlt}
                  fill
                  priority={index === 0}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  sizes="100vw"
                  className="hero-slide-image hero-img-desktop"
                  onError={(event) => {
                    if (desktopFallback && event.currentTarget.src !== desktopFallback) event.currentTarget.src = desktopFallback;
                  }}
                />
              ) : null}
              {item.imageMobileUrl || item.imageDesktopUrl ? (
                <Image
                  src={item.imageMobileUrl || item.imageDesktopUrl || ""}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="hero-slide-image hero-img-mobile"
                  aria-hidden="true"
                  onError={(event) => {
                    if (mobileFallback && event.currentTarget.src !== mobileFallback) event.currentTarget.src = mobileFallback;
                  }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="hero-overlay" />
      <span className="hero-demo-stamp" aria-hidden="true">DEMO</span>
      <div className="container hero-content">
        <span className="eyebrow">ACADEMIA DEMO VIREMARCA</span>
        <h1 id="hero-title">
          {slide.title.split(" ").map((word, index) => (
            <span
              className="hero-word"
              style={{ ["--word-delay" as string]: index * 60 + "ms" }}
              key={word + "-" + index}
            >
              {word}{" "}
            </span>
          ))}
        </h1>
        {slide.subtitle ? <p>{slide.subtitle}</p> : null}
        <div className="actions">
          <Link className="btn" href={slide.ctaHref || "/aula-experimental"}>
            {slide.ctaLabel || "QUERO TREINAR"}
          </Link>
          <Link className="btn secondary" href="/planos">VER PLANOS</Link>
        </div>
      </div>
      {safeSlides.length > 1 ? (
        <div className="hero-controls" aria-label="Controles do carrossel">
          <button
            type="button"
            onClick={() => setActive((active - 1 + safeSlides.length) % safeSlides.length)}
            aria-label="Slide anterior"
          >
            ←
          </button>
          {safeSlides.map((item, index) => (
            <button
              type="button"
              key={item.id}
              className={index === active ? "active" : ""}
              aria-label={"Ir para slide " + (index + 1)}
              aria-current={index === active}
              onClick={() => setActive(index)}
            >
              <span />
            </button>
          ))}
          <button
            type="button"
            onClick={() => setActive((active + 1) % safeSlides.length)}
            aria-label="Próximo slide"
          >
            →
          </button>
        </div>
      ) : null}
    </section>
  );
}
