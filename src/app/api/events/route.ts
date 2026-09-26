import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { analyticsEvents } from "@/db/schema";
import { hashValue, LIMITS, rateLimit } from "@/core/security/rate-limit";

const schema = z.object({
  name: z.enum([
    "page_view",
    "whatsapp_click",
    "plan_click",
    "trial_class_started",
    "lead_submitted",
    "contact_started",
  ]),
  origin: z.string().max(80).optional(),
  pagePath: z.string().max(200).optional(),
  props: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
});

export async function POST(request: NextRequest) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (
    !(await rateLimit(
      "analytics:" + hashValue(ip),
      LIMITS.analytics.limit,
      LIMITS.analytics.window,
    ))
  ) {
    return Response.json({ ok: false }, { status: 429 });
  }
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ ok: false }, { status: 400 });
  await db.insert(analyticsEvents).values({
    ...parsed.data,
    sessionHash: hashValue((h.get("user-agent") || "unknown") + "|" + ip),
  });
  return Response.json({ ok: true });
}
