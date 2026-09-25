"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Item = { id: string; imageUrl: string; imageAlt: string; caption: string | null };

export function GalleryLightbox({ items }: { items: Item[] }) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") setActive((current) => current === null ? 0 : (current + 1) % items.length);
      if (event.key === "ArrowLeft") setActive((current) => current === null ? 0 : (current - 1 + items.length) % items.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, items.length]);

  return (
    <>
      <div className="gallery-grid">
        {items.map((item, index) => (
          <button className="gallery-item" type="button" key={item.id} onClick={() => setActive(index)} aria-label={"Ampliar " + item.imageAlt}>
            <Image src={item.imageUrl} alt={item.imageAlt} width={1600} height={1067} sizes="(max-width: 800px) 50vw, 33vw" />
            {item.caption ? <span>{item.caption}</span> : null}
          </button>
        ))}
      </div>
      {active !== null ? (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Galeria ampliada" onClick={() => setActive(null)}>
          <button className="lightbox-close" type="button" onClick={() => setActive(null)} aria-label="Fechar">×</button>
          <button className="lightbox-nav prev" type="button" onClick={(event) => { event.stopPropagation(); setActive((active - 1 + items.length) % items.length); }} aria-label="Imagem anterior">←</button>
          <Image src={items[active].imageUrl} alt={items[active].imageAlt} width={1600} height={1067} sizes="90vw" onClick={(event) => event.stopPropagation()} />
          <button className="lightbox-nav next" type="button" onClick={(event) => { event.stopPropagation(); setActive((active + 1) % items.length); }} aria-label="Próxima imagem">→</button>
        </div>
      ) : null}
    </>
  );
}
