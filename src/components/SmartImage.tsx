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
  if (!src.startsWith("/") || src.startsWith("//")) {
    return null;
  }

  return path.join(process.cwd(), "public", src.replace(/^\/+/, ""));
}

export function SmartImage({
  src,
  alt,
  section,
  className = "",
  sizes = "100vw",
}: SmartImageProps) {
  const filePath = src ? publicFilePath(src) : null;
  const exists = Boolean(filePath && fs.existsSync(filePath));

  if (!src || !exists) {
    return (
      <div
        className={`${className} smart-image-fallback`.trim()}
        role="img"
        aria-label={alt}
      >
        <span>{section}</span>
      </div>
    );
  }

  return (
    <Image
      className={className}
      src={src}
      alt={alt}
      width={1600}
      height={900}
      sizes={sizes}
    />
  );
}
