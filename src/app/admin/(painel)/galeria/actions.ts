"use server";

import { asc, eq, gt, lt } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { z } from "zod";

import { assertRole } from "@/core/auth/guards";
import { deleteBlobIfUnused } from "@/core/media/actions";
import { db } from "@/db";
import { auditLog, galleryItems } from "@/db/schema";

const schema = z.object({
  id: z.string().uuid().optional(),
  area: z.string().trim().min(2).max(100),
  imageUrl: z.string().min(1).max(1000),
  imageAlt: z.string().trim().min(1).max(180),
  caption: z.string().max(300),
  isIllustration: z.enum(["on", "off"]).default("off"),
  active: z.enum(["on", "off"]).default("off"),
  sortOrder: z.coerce.number().int().min(0),
});

export async function mutateGallery(formData: FormData) {
  const actor = await assertRole("staff");
  const intent = String(formData.get("intent") || "save");
  const id = String(formData.get("id") || "");
  const current = id ? (await db.select().from(galleryItems).where(eq(galleryItems.id, id)).limit(1))[0] : null;

  if (["delete", "up", "down", "toggle"].includes(intent)) {
    if (!current) throw new Error("Imagem da galeria não encontrada.");
    if (intent === "delete") {
      await db.delete(galleryItems).where(eq(galleryItems.id, id));
      await deleteBlobIfUnused(current.imageUrl);
    } else if (intent === "toggle") {
      await db.update(galleryItems).set({ active: !current.active, updatedBy: actor.id }).where(eq(galleryItems.id, id));
    } else {
      const other = intent === "up"
        ? (await db.select().from(galleryItems).where(lt(galleryItems.sortOrder, current.sortOrder)).orderBy(asc(galleryItems.sortOrder)).limit(1))[0]
        : (await db.select().from(galleryItems).where(gt(galleryItems.sortOrder, current.sortOrder)).orderBy(asc(galleryItems.sortOrder)).limit(1))[0];
      if (other) {
        await db.update(galleryItems).set({ sortOrder: other.sortOrder, updatedBy: actor.id }).where(eq(galleryItems.id, id));
        await db.update(galleryItems).set({ sortOrder: current.sortOrder, updatedBy: actor.id }).where(eq(galleryItems.id, other.id));
      }
    }
    await db.insert(auditLog).values({ actorId: actor.id, action: intent, entity: "gallery_item", entityId: id });
    revalidateTag("gallery");
    return;
  }

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error("Dados da galeria inválidos.");
  const d = parsed.data;
  const entityId = d.id || crypto.randomUUID();
  const values = {
    area: d.area,
    imageUrl: d.imageUrl,
    imageAlt: d.imageAlt,
    caption: d.caption || null,
    isIllustration: d.isIllustration === "on",
    active: d.active === "on",
    sortOrder: d.sortOrder,
    updatedBy: actor.id,
  };

  if (d.id) await db.update(galleryItems).set(values).where(eq(galleryItems.id, d.id));
  else await db.insert(galleryItems).values({ ...values, id: entityId, createdBy: actor.id });
  if (current && current.imageUrl !== values.imageUrl) await deleteBlobIfUnused(current.imageUrl);

  await db.insert(auditLog).values({ actorId: actor.id, action: d.id ? "update" : "create", entity: "gallery_item", entityId });
  revalidateTag("gallery");
}
