import fs from "node:fs";
import path from "node:path";

import { asc } from "drizzle-orm";

import { db } from "@/db";
import { media } from "@/db/schema";

const IMAGE_RE = /\.(webp|jpe?g|png)$/i;

export type PublicImageChoice = { url: string; label: string };

export function getPublicImageChoices(): PublicImageChoice[] {
  const root = path.join(process.cwd(), "public", "images");
  if (!fs.existsSync(root)) return [];

  const walk = (dir: string, prefix = ""): PublicImageChoice[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const relative = prefix ? prefix + "/" + entry.name : entry.name;
      if (entry.isDirectory()) return walk(path.join(dir, entry.name), relative);
      if (!IMAGE_RE.test(entry.name)) return [];
      return [{ url: "/images/" + relative, label: relative }];
    });

  return walk(root).sort((a, b) => a.label.localeCompare(b.label));
}

export async function getImageChoices(): Promise<PublicImageChoice[]> {
  const [publicImages, mediaRows] = await Promise.all([
    Promise.resolve(getPublicImageChoices()),
    db.select({ url: media.url, alt: media.alt }).from(media).orderBy(asc(media.createdAt)),
  ]);

  return [
    ...mediaRows.map((item) => ({ url: item.url, label: "Blob · " + item.alt })),
    ...publicImages,
  ];
}
