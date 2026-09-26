"use server";

import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { z } from "zod";

import { assertRole } from "@/core/auth/guards";
import { deleteBlobIfUnused } from "@/core/media/actions";
import { db } from "@/db";
import { auditLog, openingExceptions, siteSettings } from "@/db/schema";

const text = (max: number) => z.string().trim().max(max).transform((value) => value === "" ? null : value);
const exceptionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  label: z.string().trim().min(1).max(120),
  closed: z.boolean(),
  open: z.string(),
  close: z.string(),
});
const schema = z.object({
  name: z.string().trim().min(2).max(120),
  slogan: text(160),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  whatsapp: text(20),
  whatsappMessage: text(300),
  phone: text(40),
  email: text(120),
  street: text(120),
  number: text(20),
  district: text(80),
  city: text(80),
  state: text(2),
  zip: text(12),
  mapEmbedUrl: text(1000),
  instagram: text(200),
  facebook: text(200),
  seoTitle: text(70),
  seoDescription: text(170),
  seoRegion: text(80),
  notice: text(200),
  noticeExpiresAt: text(20),
  logoLightUrl: text(1000),
  logoDarkUrl: text(1000),
  monogramUrl: text(1000),
  wellhubEnabled: z.boolean(),
  totalpassEnabled: z.boolean(),
  isDemo: z.boolean(),
  openingHoursJson: z.string(),
  openingExceptionsJson: z.string(),
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
  if (!parsed.success) return { ok: false, message: parsed.error.issues.map((item) => item.message).join(" · ") };

  const data = parsed.data;
  let openingHours: unknown;
  let exceptions: unknown;
  try {
    openingHours = JSON.parse(data.openingHoursJson);
    exceptions = JSON.parse(data.openingExceptionsJson);
  } catch {
    return { ok: false, message: "Horários inválidos." };
  }

  const parsedExceptions = z.array(exceptionSchema).safeParse(exceptions);
  if (!parsedExceptions.success) return { ok: false, message: "Exceções de funcionamento inválidas." };
  const current = (await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1))[0];

  await db.update(siteSettings).set({
    name: data.name,
    slogan: data.slogan,
    accentColor: data.accentColor,
    whatsapp: data.whatsapp,
    whatsappMessage: data.whatsappMessage,
    phone: data.phone,
    email: data.email,
    logoLightUrl: data.logoLightUrl,
    logoDarkUrl: data.logoDarkUrl,
    monogramUrl: data.monogramUrl,
    address: {
      street: data.street || undefined,
      number: data.number || undefined,
      district: data.district || undefined,
      city: data.city || undefined,
      state: data.state || undefined,
      zip: data.zip || undefined,
    },
    mapEmbedUrl: data.mapEmbedUrl,
    openingHours: openingHours as never,
    notice: data.notice,
    noticeExpiresAt: data.noticeExpiresAt ? new Date(data.noticeExpiresAt + "T23:59:59-03:00") : null,
    social: { instagram: data.instagram || undefined, facebook: data.facebook || undefined },
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    seoRegion: data.seoRegion,
    wellhubEnabled: data.wellhubEnabled,
    totalpassEnabled: data.totalpassEnabled,
    isDemo: data.isDemo,
    updatedBy: actor.id,
  }).where(eq(siteSettings.id, 1));

  await db.delete(openingExceptions);
  if (parsedExceptions.data.length) {
    await db.insert(openingExceptions).values(parsedExceptions.data.map((item) => ({
      id: crypto.randomUUID(),
      date: item.date,
      label: item.label,
      closed: item.closed,
      open: item.closed ? null : item.open || null,
      close: item.closed ? null : item.close || null,
      createdBy: actor.id,
    })));
  }

  await db.insert(auditLog).values({ actorId: actor.id, action: "update", entity: "site_settings", entityId: "1" });
  await Promise.all([
    current?.logoLightUrl !== data.logoLightUrl ? deleteBlobIfUnused(current?.logoLightUrl) : Promise.resolve(),
    current?.logoDarkUrl !== data.logoDarkUrl ? deleteBlobIfUnused(current?.logoDarkUrl) : Promise.resolve(),
    current?.monogramUrl !== data.monogramUrl ? deleteBlobIfUnused(current?.monogramUrl) : Promise.resolve(),
  ]);
  revalidateTag("settings");
  return { ok: true, message: "Configurações salvas. O site atualiza em instantes." };
}
