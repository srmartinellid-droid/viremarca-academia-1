"use server";

import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { auditLog, posts } from "@/db/schema";
import { assertRole } from "@/core/auth/guards";
import { sanitizeRichHtml } from "@/lib/sanitize-html";

const schema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(3).max(180),
  slug: z.string().trim().min(3).max(180),
  excerpt: z.string().max(500),
  coverUrl: z.string().max(1000),
  categoryId: z.string().uuid().optional().or(z.literal("")),
  status: z.enum(["draft", "scheduled", "published"]),
  publishedAt: z.string().optional(),
  contentHtml: z.string().max(30000),
});

export async function mutatePost(formData: FormData) {
  const actor = await assertRole("staff");
  const intent = String(formData.get("intent") || "save");
  const id = String(formData.get("id") || "");
  const current = id
    ? (await db.select().from(posts).where(eq(posts.id, id)).limit(1))[0]
    : null;

  if (intent === "delete") {
    if (!current) throw new Error("Publicação não encontrada.");
    await db.delete(posts).where(eq(posts.id, id));
    await db.insert(auditLog).values({
      actorId: actor.id,
      action: "delete",
      entity: "post",
      entityId: id,
    });
    revalidateTag("posts");
    return;
  }

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error("Dados da publicação inválidos.");
  const d = parsed.data;
  const entityId = d.id || crypto.randomUUID();
  const publishedAt = d.publishedAt ? new Date(d.publishedAt) : null;

  if ((d.status === "published" || d.status === "scheduled") && !publishedAt) {
    throw new Error("Data de publicação obrigatória.");
  }

  const values = {
    title: d.title,
    slug: d.slug,
    excerpt: d.excerpt || null,
    coverUrl: d.coverUrl || null,
    categoryId: d.categoryId || null,
    status: d.status,
    publishedAt,
    contentHtml: sanitizeRichHtml(d.contentHtml),
    updatedBy: actor.id,
  };

  if (d.id) {
    await db.update(posts).set(values).where(eq(posts.id, d.id));
  } else {
    await db.insert(posts).values({
      ...values,
      id: entityId,
      createdBy: actor.id,
      tags: [],
    });
  }

  await db.insert(auditLog).values({
    actorId: actor.id,
    action: d.id ? "update" : "create",
    entity: "post",
    entityId,
  });
  revalidateTag("posts");
}
