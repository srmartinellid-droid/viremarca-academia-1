"use server";

import { randomUUID } from "node:crypto";

import { del, put } from "@vercel/blob";
import { eq, or } from "drizzle-orm";
import sharp from "sharp";
import { z } from "zod";

import { assertRole } from "@/core/auth/guards";
import { db } from "@/db";
import {
  auditLog,
  galleryItems,
  heroSlides,
  instructors,
  media,
  modalities,
  posts,
  siteSettings,
} from "@/db/schema";

const purposes = {
  "hero-desktop": 2400,
  "hero-mobile": 1080,
  modality: 1200,
  team: 800,
  gallery: 1600,
  cover: 1600,
  logo: 800,
} as const;

const mimeSchema = z.enum(["image/jpeg", "image/png", "image/webp"]);

export type UploadResult =
  | { ok: true; url: string; width: number; height: number; alt: string }
  | { ok: false; message: string };

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  const actor = await assertRole("staff");
  const file = formData.get("file");
  const purpose = String(formData.get("purpose") || "");
  const alt = String(formData.get("alt") || "").trim();

  if (!(file instanceof File)) return { ok: false, message: "Selecione uma imagem." };
  if (!mimeSchema.safeParse(file.type).success) {
    return { ok: false, message: "Formato recusado. Envie JPG, PNG ou WebP." };
  }
  if (!alt) return { ok: false, message: "O texto alternativo é obrigatório." };
  if (!(purpose in purposes)) {
    return { ok: false, message: "Finalidade de imagem inválida." };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { ok: false, message: "Arquivo acima de 8 MB. Escolha uma imagem menor." };
  }

  const input = Buffer.from(await file.arrayBuffer());
  const magic = input.subarray(0, 12);
  const validMagic =
    (file.type === "image/jpeg" && magic[0] === 0xff && magic[1] === 0xd8 && magic[2] === 0xff) ||
    (file.type === "image/png" && magic.toString("hex", 0, 8) === "89504e470d0a1a0a") ||
    (file.type === "image/webp" &&
      magic.toString("ascii", 0, 4) === "RIFF" &&
      magic.toString("ascii", 8, 12) === "WEBP");

  if (!validMagic) {
    return { ok: false, message: "O conteúdo do arquivo não corresponde ao formato informado." };
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { ok: false, message: "Armazenamento de imagens não configurado" };
  }

  try {
    const maxWidth = purposes[purpose as keyof typeof purposes];
    const output = await sharp(input, { failOn: "error" })
      .rotate()
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    const pathname = "academia/" + purpose + "/" + randomUUID() + ".webp";
    const blob = await put(pathname, output, {
      access: "public",
      contentType: "image/webp",
    });
    const metadata = await sharp(output).metadata();

    await db.insert(media).values({
      id: randomUUID(),
      url: blob.url,
      pathname,
      mimeType: "image/webp",
      sizeBytes: output.byteLength,
      width: metadata.width || null,
      height: metadata.height || null,
      alt,
      createdBy: actor.id,
    });
    await db.insert(auditLog).values({
      actorId: actor.id,
      action: "create",
      entity: "media",
      entityId: pathname,
    });

    return {
      ok: true,
      url: blob.url,
      width: metadata.width || 0,
      height: metadata.height || 0,
      alt,
    };
  } catch (error) {
    console.error("uploadImage", error);
    return { ok: false, message: "Não foi possível processar a imagem." };
  }
}

export async function updateMediaAlt(id: string, alt: string) {
  const actor = await assertRole("staff");
  const parsed = z
    .object({ id: z.string().uuid(), alt: z.string().trim().min(1).max(180) })
    .safeParse({ id, alt });
  if (!parsed.success) throw new Error("Dados de imagem inválidos.");

  await db
    .update(media)
    .set({ alt: parsed.data.alt, updatedBy: actor.id })
    .where(eq(media.id, parsed.data.id));
  await db.insert(auditLog).values({
    actorId: actor.id,
    action: "update",
    entity: "media",
    entityId: parsed.data.id,
  });
}

async function isUsed(url: string) {
  const [hero, modality, instructor, gallery, post, settings] = await Promise.all([
    db.select({ id: heroSlides.id }).from(heroSlides).where(or(eq(heroSlides.imageDesktopUrl, url), eq(heroSlides.imageMobileUrl, url))).limit(1),
    db.select({ id: modalities.id }).from(modalities).where(eq(modalities.imageUrl, url)).limit(1),
    db.select({ id: instructors.id }).from(instructors).where(eq(instructors.photoUrl, url)).limit(1),
    db.select({ id: galleryItems.id }).from(galleryItems).where(eq(galleryItems.imageUrl, url)).limit(1),
    db.select({ id: posts.id }).from(posts).where(eq(posts.coverUrl, url)).limit(1),
    db.select({ id: siteSettings.id }).from(siteSettings).where(or(eq(siteSettings.logoLightUrl, url), eq(siteSettings.logoDarkUrl, url), eq(siteSettings.monogramUrl, url))).limit(1),
  ]);

  return Boolean(hero.length || modality.length || instructor.length || gallery.length || post.length || settings.length);
}

export async function deleteMedia(id: string) {
  const actor = await assertRole("staff");
  const parsedId = z.string().uuid().safeParse(id);
  if (!parsedId.success) throw new Error("ID de imagem inválido.");

  const row = (await db.select().from(media).where(eq(media.id, parsedId.data)).limit(1))[0];
  if (!row) throw new Error("Imagem não encontrada.");
  if (await isUsed(row.url)) throw new Error("A imagem está em uso e não pode ser excluída.");

  if (row.url.includes(".public.blob.vercel-storage.com")) await del(row.url);
  await db.delete(media).where(eq(media.id, parsedId.data));
  await db.insert(auditLog).values({
    actorId: actor.id,
    action: "delete",
    entity: "media",
    entityId: parsedId.data,
  });
}

export async function deleteBlobIfUnused(url: string | null | undefined) {
  if (!url || !url.includes(".public.blob.vercel-storage.com")) return;
  if (await isUsed(url)) return;
  const row = (await db.select().from(media).where(eq(media.url, url)).limit(1))[0];
  if (!row) return;
  await del(url);
  await db.delete(media).where(eq(media.id, row.id));
}
