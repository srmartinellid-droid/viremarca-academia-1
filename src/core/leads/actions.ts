"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { leadEvents, leads, modalities, siteSettings } from "@/db/schema";
import { hashValue, LIMITS, rateLimit } from "@/core/security/rate-limit";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().regex(/^\+?55\s?\(?\d{2}\)?\s?9?\d{4}[-\s]?\d{4}$/),
  modalityId: z.string().uuid().nullable(),
  preferredTime: z.string().trim().min(2).max(40),
  consent: z.literal("on"),
  honeypot: z.string().max(0).optional(),
  pagePath: z.string().max(200).optional(),
});

export async function submitTrialLead(input: Record<string, string>) {
  if (input.honeypot) return { ok: false as const, error: "Não foi possível enviar." };

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ua = requestHeaders.get("user-agent") || "unknown";
  const key = "lead:" + hashValue(ip + "|" + ua);
  if (!(await rateLimit(key, LIMITS.lead.limit, LIMITS.lead.window))) {
    return { ok: false as const, error: "Aguarde alguns minutos e tente novamente." };
  }

  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Confira os campos do formulário." };

  const settings = await db.select({ consentTextVersion: siteSettings.consentTextVersion, whatsapp: siteSettings.whatsapp, whatsappMessage: siteSettings.whatsappMessage }).from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
  const config = settings[0];
  if (!config) return { ok: false as const, error: "Configuração indisponível." };

  const phone = parsed.data.phone.replace(/\D/g, "");
  const lead = await db.insert(leads).values({
    name: parsed.data.name,
    phone,
    source: "aula_experimental",
    modalityId: parsed.data.modalityId || null,
    preferredTime: parsed.data.preferredTime,
    consentTextVersion: config.consentTextVersion,
    consentAt: new Date(),
    pagePath: parsed.data.pagePath || "/aula-experimental",
    userAgentHash: hashValue(ua),
  }).returning({ id: leads.id });

  await db.insert(leadEvents).values({
    leadId: lead[0].id,
    type: "created",
  });

  const modality = parsed.data.modalityId
    ? await db.select({ name: modalities.name }).from(modalities).where(eq(modalities.id, parsed.data.modalityId)).limit(1)
    : [];
  const message = [
    config.whatsappMessage || "Olá! Quero agendar minha aula experimental.",
    "Nome: " + parsed.data.name,
    "WhatsApp: +" + phone,
    "Modalidade: " + (modality[0]?.name || "A definir"),
    "Melhor período: " + parsed.data.preferredTime,
  ].join("\n");

  const waPhone = (config.whatsapp || "").replace(/\D/g, "");
  return {
    ok: true as const,
    url: waPhone ? "https://wa.me/" + waPhone + "?text=" + encodeURIComponent(message) : "/contato",
  };
}
