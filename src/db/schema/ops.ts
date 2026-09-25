/**
 * Operação: leads, eventos, rate limit e auditoria.
 * Nada disso é lido pelo público. Escrita só via servidor.
 */
import { sql } from "drizzle-orm";
import {
  bigserial,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { plans, modalities } from "./content";
import { timestamps } from "./_shared";

export const leadStatus = pgEnum("lead_status", ["novo", "em_contato", "matriculado", "perdido"]);
export const leadSource = pgEnum("lead_source", [
  "aula_experimental",
  "contato",
  "plano",
  "whatsapp",
  "outro",
]);

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    phone: text("phone").notNull(), // WhatsApp do interessado
    email: text("email"),
    source: leadSource("source").default("outro").notNull(),
    modalityId: uuid("modality_id").references(() => modalities.id, { onDelete: "set null" }),
    planId: uuid("plan_id").references(() => plans.id, { onDelete: "set null" }),
    preferredTime: text("preferred_time"),
    message: text("message"),
    status: leadStatus("status").default("novo").notNull(),
    notes: text("notes"),
    consentTextVersion: text("consent_text_version").notNull(),
    consentAt: timestamp("consent_at", { withTimezone: true }).defaultNow().notNull(),
    pagePath: text("page_path"),
    utm: jsonb("utm").$type<Record<string, string>>(),
    userAgentHash: text("user_agent_hash"), // hash, nunca o UA/IP em texto puro
    assignedTo: text("assigned_to").references(() => user.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (t) => [
    index("leads_status_created_idx").on(t.status, t.createdAt),
    index("leads_created_idx").on(t.createdAt),
    index("leads_source_idx").on(t.source),
  ],
);

export const leadEvents = pgTable(
  "lead_events",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // created, status_changed, note_added, whatsapp_opened
    fromStatus: leadStatus("from_status"),
    toStatus: leadStatus("to_status"),
    note: text("note"),
    actorId: text("actor_id").references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("lead_events_lead_idx").on(t.leadId, t.createdAt)],
);

/** Allowlist também garantida no banco. Manter em sincronia com src/core/analytics/events.ts */
export const ANALYTICS_EVENTS = [
  "page_view",
  "whatsapp_click",
  "plan_click",
  "trial_class_started",
  "lead_submitted",
  "contact_started",
] as const;

export const analyticsEvents = pgTable(
  "analytics_events",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    name: text("name").notNull(),
    origin: text("origin"), // hero, plano, aula, flutuante, cta, rodape…
    pagePath: text("page_path"),
    props: jsonb("props").$type<Record<string, string | number | boolean>>(),
    sessionHash: text("session_hash"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    check(
      "analytics_events_name_allowlist",
      sql.raw(`name in (${ANALYTICS_EVENTS.map((e) => `'${e}'`).join(", ")})`),
    ),
    index("analytics_events_name_created_idx").on(t.name, t.createdAt),
    index("analytics_events_created_idx").on(t.createdAt),
  ],
);

/** Rate limit persistente (janela fixa). Nunca em memória: serverless não compartilha estado. */
export const rateLimits = pgTable(
  "rate_limits",
  {
    key: text("key").primaryKey(), // ex.: "lead:<hash>", "login:<email-hash>:<ip-hash>"
    count: integer("count").default(0).notNull(),
    windowStart: timestamp("window_start", { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (t) => [index("rate_limits_expires_idx").on(t.expiresAt)],
);

export const auditLog = pgTable(
  "audit_log",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    actorId: text("actor_id").references(() => user.id, { onDelete: "set null" }),
    action: text("action").notNull(), // create, update, delete, login, password_change…
    entity: text("entity").notNull(),
    entityId: text("entity_id"),
    diff: jsonb("diff"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("audit_log_entity_idx").on(t.entity, t.entityId),
    index("audit_log_created_idx").on(t.createdAt),
  ],
);
