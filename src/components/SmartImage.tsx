import fs from "node:fs";
import path from "node:path";

import Image from "next/image";

type SmartImageProps = {
  src?: string | null;
  alt: string;
  section: string;
  className?: string;
  sizes?: string;
};

function publicFilePath(src: string) {
  if (!src.startsWith("/") || src.startsWith("//")) return null;
  return path.join(process.cwd(), "public", src.replace(/^\/+/, ""));
}

function demoFallbackFor(src: string) {
  const value = src.toLowerCase();
  if (value.includes("/equipe/")) return "/images/demo/coach.svg";
  if (value.includes("/estrutura/")) return "/images/demo/estrutura.svg";
  if (value.includes("/blog/")) return "/images/demo/editorial.svg";
  if (value.includes("/lutas") || value.includes("/muay-thai")) return "/images/demo/lutas.svg";
  if (value.includes("/modalidades/")) return value.includes("musculacao") ? "/images/demo/musculacao.svg" : "/images/demo/funcional.svg";
  return null;
}

export function SmartImage({
  src,
  alt,
  section,
  className = "",
  sizes = "100vw",
}: SmartImageProps) {
  const originalPath = src ? publicFilePath(src) : null;
  const originalExists = Boolean(originalPath && fs.existsSync(originalPath));
  const fallbackSrc = !originalExists && src ? demoFallbackFor(src) : null;
  const resolvedSrc = originalExists ? src : fallbackSrc;
  const resolvedPath = resolvedSrc ? publicFilePath(resolvedSrc) : null;
  const exists = Boolean(resolvedPath && fs.existsSync(resolvedPath));

  if (!resolvedSrc || !exists) {
    return (
      <div className={(className + " smart-image-fallback").trim()} role="img" aria-label={alt}>
        <span className="smart-image-mark" aria-hidden="true" />
        <strong>{section}</strong>
      </div>
    );
  }

  return (
    <Image
      className={className}
      src={resolvedSrc}
      alt={alt}
      width={1600}
      height={900}
      sizes={sizes}
    />
  );
}
