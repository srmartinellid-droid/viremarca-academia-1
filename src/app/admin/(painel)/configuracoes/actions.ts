"use server";

import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { auditLog, siteSettings } from "@/db/schema";
import { assertRole } from "@/core/auth/guards";

const text = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? null : v));

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  slogan: text(160),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida (use #RRGGBB)"),
  whatsapp: text(20).refine(
    (v) => v === null || /^\+?\d{12,13}$/.test(v),
    "WhatsApp: +55DDDNÚMERO",
  ),
  whatsappMessage: text(300),
  phone: text(40),
  email: text(120).refine(
    (v) => v === null || z.string().email().safeParse(v).success,
    "E-mail inválido",
  ),
  street: text(120),
  number: text(20),
  district: text(80),
  city: text(80),
  state: text(2),
  zip: text(12),
  mapEmbedUrl: text(1000).refine(
    (v) => v === null || v.startsWith("https://www.google.com/maps/embed"),
    "Use o link de incorporação do Google Maps",
  ),
  notice: text(200),
  noticeExpiresAt: text(20),
  instagram: text(200),
  facebook: text(200),
  seoTitle: text(70),
  seoDescription: text(170),
  seoRegion: text(80),
  wellhubEnabled: z.boolean(),
  totalpassEnabled: z.boolean(),
  isDemo: z.boolean(),
});

export type SettingsState = { ok: boolean; message: string };

export async function saveSettings(_: SettingsState, formData: FormData): Promise<SettingsState> {
  const actor = await assertRole("owner");
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse({
    ...raw,
    wellhubEnabled: raw.wellhubEnabled === "on",
    totalpassEnabled: raw.totalpassEnabled === "on",
    isDemo: raw.isDemo === "on",
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues.map((i) => i.message).join(" · ") };
  }
  const d = parsed.data;
  await db
    .update(siteSettings)
    .set({
      name: d.name,
      slogan: d.slogan,
      accentColor: d.accentColor,
      whatsapp: d.whatsapp,
      whatsappMessage: d.whatsappMessage,
      phone: d.phone,
      email: d.email,
      address: {
        street: d.street ?? undefined,
        number: d.number ?? undefined,
        district: d.district ?? undefined,
        city: d.city ?? undefined,
        state: d.state ?? undefined,
        zip: d.zip ?? undefined,
      },
      mapEmbedUrl: d.mapEmbedUrl,
      notice: d.notice,
      noticeExpiresAt: d.noticeExpiresAt ? new Date(d.noticeExpiresAt + "T23:59:59-03:00") : null,
      social: { instagram: d.instagram ?? undefined, facebook: d.facebook ?? undefined },
      seoTitle: d.seoTitle,
      seoDescription: d.seoDescription,
      seoRegion: d.seoRegion,
      wellhubEnabled: d.wellhubEnabled,
      totalpassEnabled: d.totalpassEnabled,
      isDemo: d.isDemo,
      updatedBy: actor.id,
    })
    .where(eq(siteSettings.id, 1));
  await db
    .insert(auditLog)
    .values({ actorId: actor.id, action: "update", entity: "site_settings", entityId: "1" });
  revalidateTag("settings");
  return { ok: true, message: "Configurações salvas. O site atualiza em instantes." };
}
