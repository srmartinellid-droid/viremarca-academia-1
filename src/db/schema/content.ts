/**
 * Conteúdo editável pelo admin. Leitura pública SEMPRE filtra active/published
 * (ver src/lib/queries/public.ts). Nada aqui é dado real: o seed é demo.
 */
import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  smallint,
  text,
  time,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authorship, timestamps } from "./_shared";

/* ---------- Configurações (registro único) ---------- */

export type Address = {
  street?: string;
  number?: string;
  district?: string;
  city?: string;
  state?: string;
  zip?: string;
  lat?: number;
  lng?: number;
};
export type OpeningHours = Record<
  "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun",
  { open: string; close: string }[] | null
>;
export type SocialLinks = {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
};

export const siteSettings = pgTable(
  "site_settings",
  {
    id: smallint("id").primaryKey().default(1),
    // Identidade
    name: text("name").notNull(),
    slogan: text("slogan"),
    logoLightUrl: text("logo_light_url"),
    logoDarkUrl: text("logo_dark_url"),
    monogramUrl: text("monogram_url"),
    accentColor: text("accent_color").default("#C6FF00").notNull(),
    // Contato
    whatsapp: text("whatsapp"), // E.164, ex.: +5548900000000
    whatsappMessage: text("whatsapp_message"),
    phone: text("phone"),
    email: text("email"),
    address: jsonb("address").$type<Address>(),
    mapEmbedUrl: text("map_embed_url"),
    // Funcionamento
    openingHours: jsonb("opening_hours").$type<OpeningHours>(),
    notice: text("notice"),
    noticeExpiresAt: timestamp("notice_expires_at", { withTimezone: true }),
    // Redes
    social: jsonb("social").$type<SocialLinks>(),
    // Legal
    legalName: text("legal_name"),
    cnpj: text("cnpj"),
    consentTextVersion: text("consent_text_version").default("v1").notNull(),
    // SEO
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    seoRegion: text("seo_region"),
    // Analytics (GA4/Pixel desligados por padrão)
    analyticsEnabled: boolean("analytics_enabled").default(true).notNull(),
    ga4Id: text("ga4_id"),
    metaPixelId: text("meta_pixel_id"),
    // Agregadores
    wellhubEnabled: boolean("wellhub_enabled").default(false).notNull(),
    wellhubUrl: text("wellhub_url"),
    totalpassEnabled: boolean("totalpass_enabled").default(false).notNull(),
    totalpassUrl: text("totalpass_url"),
    // Integrações futuras (P2) — só links, nenhuma API é chamada
    integrations: jsonb("integrations").$type<Record<string, string>>(),
    isDemo: boolean("is_demo").default(true).notNull(),
    ...authorship,
    ...timestamps,
  },
  (t) => [
    check("site_settings_singleton", sql`${t.id} = 1`),
    check("site_settings_accent_hex", sql`${t.accentColor} ~ '^#[0-9A-Fa-f]{6}$'`),
  ],
);

/* ---------- Holidays / exceções de horário ---------- */

export const openingExceptions = pgTable(
  "opening_exceptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    date: text("date").notNull(), // YYYY-MM-DD
    label: text("label").notNull(),
    closed: boolean("closed").default(true).notNull(),
    open: time("open"),
    close: time("close"),
    ...authorship,
    ...timestamps,
  },
  (t) => [index("opening_exceptions_date_idx").on(t.date)],
);

/* ---------- Mídia ---------- */

export const media = pgTable(
  "media",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    url: text("url").notNull(),
    pathname: text("pathname").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    width: integer("width"),
    height: integer("height"),
    alt: text("alt").notNull(),
    credit: text("credit"), // origem/licença (docs/CREDITOS_IMAGENS.md)
    ...authorship,
    ...timestamps,
  },
  (t) => [check("media_size_limit", sql`${t.sizeBytes} <= 5242880`)],
);

/* ---------- Home ---------- */

export const homeSections = pgTable(
  "home_sections",
  {
    key: text("key").primaryKey(), // hero, stats, modalities, schedule, plans, trial, instructors, gallery, posts, testimonials, faq, location, aggregators
    title: text("title"),
    subtitle: text("subtitle"),
    active: boolean("active").default(true).notNull(),
    sortOrder: integer("sort_order").notNull(),
    ...authorship,
    ...timestamps,
  },
  (t) => [index("home_sections_active_order_idx").on(t.active, t.sortOrder)],
);

export const heroSlides = pgTable(
  "hero_slides",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    ctaLabel: text("cta_label"),
    ctaHref: text("cta_href"),
    imageDesktopUrl: text("image_desktop_url"),
    imageMobileUrl: text("image_mobile_url"),
    imageAlt: text("image_alt").notNull(),
    active: boolean("active").default(true).notNull(),
    sortOrder: integer("sort_order").notNull(),
    ...authorship,
    ...timestamps,
  },
  (t) => [index("hero_slides_active_order_idx").on(t.active, t.sortOrder)],
);

export const stats = pgTable(
  "stats",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    value: text("value").notNull(), // "24", "1.200"
    suffix: text("suffix"), // "h", "m²", "+"
    label: text("label").notNull(),
    active: boolean("active").default(true).notNull(),
    sortOrder: integer("sort_order").notNull(),
    ...authorship,
    ...timestamps,
  },
  (t) => [index("stats_active_order_idx").on(t.active, t.sortOrder)],
);

/* ---------- Modalidades / horários ---------- */

export const modalityLevel = pgEnum("modality_level", [
  "todos",
  "iniciante",
  "intermediario",
  "avancado",
]);

export const modalities = pgTable(
  "modalities",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    summary: text("summary"),
    description: text("description"),
    level: modalityLevel("level").default("todos").notNull(),
    durationMin: integer("duration_min"),
    imageUrl: text("image_url"),
    imageAlt: text("image_alt"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    active: boolean("active").default(true).notNull(),
    sortOrder: integer("sort_order").notNull(),
    ...authorship,
    ...timestamps,
  },
  (t) => [index("modalities_active_order_idx").on(t.active, t.sortOrder)],
);

export const instructors = pgTable(
  "instructors",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    role: text("role"),
    specialties: text("specialties"),
    bio: text("bio"),
    photoUrl: text("photo_url"),
    photoAlt: text("photo_alt"),
    professionalRegistry: text("professional_registry"), // CREF: opcional, vazio por padrão
    instagram: text("instagram"),
    active: boolean("active").default(true).notNull(),
    sortOrder: integer("sort_order").notNull(),
    ...authorship,
    ...timestamps,
  },
  (t) => [index("instructors_active_order_idx").on(t.active, t.sortOrder)],
);

export const classSchedule = pgTable(
  "class_schedule",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    modalityId: uuid("modality_id")
      .notNull()
      .references(() => modalities.id, { onDelete: "cascade" }),
    instructorId: uuid("instructor_id").references(() => instructors.id, { onDelete: "set null" }),
    weekday: smallint("weekday").notNull(), // 0=domingo … 6=sábado
    startsAt: time("starts_at").notNull(),
    endsAt: time("ends_at").notNull(),
    room: text("room"),
    capacity: integer("capacity"),
    active: boolean("active").default(true).notNull(),
    ...authorship,
    ...timestamps,
  },
  (t) => [
    check("class_schedule_weekday", sql`${t.weekday} between 0 and 6`),
    check("class_schedule_time_order", sql`${t.endsAt} > ${t.startsAt}`),
    index("class_schedule_day_time_idx").on(t.active, t.weekday, t.startsAt),
  ],
);

/* ---------- Planos ---------- */

export const planPeriod = pgEnum("plan_period", [
  "mensal",
  "trimestral",
  "semestral",
  "anual",
  "avulso",
]);

export const plans = pgTable(
  "plans",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    period: planPeriod("period").notNull(),
    priceCents: integer("price_cents").notNull(),
    installmentsNote: text("installments_note"),
    benefits: jsonb("benefits").$type<string[]>().default([]).notNull(),
    highlighted: boolean("highlighted").default(false).notNull(),
    badge: text("badge"),
    ctaLabel: text("cta_label"),
    active: boolean("active").default(true).notNull(),
    sortOrder: integer("sort_order").notNull(),
    ...authorship,
    ...timestamps,
  },
  (t) => [
    check("plans_price_positive", sql`${t.priceCents} >= 0`),
    index("plans_active_order_idx").on(t.active, t.sortOrder),
  ],
);

/* ---------- Galeria ---------- */

export const galleryItems = pgTable(
  "gallery_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    area: text("area").notNull(), // musculação, funcional, vestiário…
    imageUrl: text("image_url").notNull(),
    imageAlt: text("image_alt").notNull(),
    caption: text("caption"),
    isIllustration: boolean("is_illustration").default(false).notNull(),
    active: boolean("active").default(true).notNull(),
    sortOrder: integer("sort_order").notNull(),
    ...authorship,
    ...timestamps,
  },
  (t) => [index("gallery_active_order_idx").on(t.active, t.sortOrder)],
);

/* ---------- Publicações ---------- */

export const postStatus = pgEnum("post_status", ["draft", "scheduled", "published"]);

export const postCategories = pgTable("post_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  ...timestamps,
});

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    excerpt: text("excerpt"),
    content: jsonb("content").$type<unknown>(), // documento do editor rico
    contentHtml: text("content_html"), // HTML sanitizado para renderização
    coverUrl: text("cover_url"),
    coverAlt: text("cover_alt"),
    categoryId: uuid("category_id").references(() => postCategories.id, { onDelete: "set null" }),
    tags: jsonb("tags").$type<string[]>().default([]).notNull(),
    status: postStatus("status").default("draft").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    featured: boolean("featured").default(false).notNull(),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    ogImageUrl: text("og_image_url"),
    ...authorship,
    ...timestamps,
  },
  (t) => [
    check("posts_published_has_date", sql`${t.status} = 'draft' or ${t.publishedAt} is not null`),
    index("posts_status_published_idx").on(t.status, t.publishedAt),
  ],
);

/* ---------- Prova social / FAQ ---------- */

export const testimonials = pgTable(
  "testimonials",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    authorName: text("author_name").notNull(),
    authorInfo: text("author_info"),
    quote: text("quote").notNull(),
    rating: smallint("rating"),
    photoUrl: text("photo_url"),
    isDemo: boolean("is_demo").default(false).notNull(), // exibe selo "Demo"
    active: boolean("active").default(false).notNull(), // publicação controlada
    sortOrder: integer("sort_order").notNull(),
    ...authorship,
    ...timestamps,
  },
  (t) => [
    check("testimonials_rating", sql`${t.rating} is null or ${t.rating} between 1 and 5`),
    index("testimonials_active_order_idx").on(t.active, t.sortOrder),
  ],
);

export const faqs = pgTable(
  "faqs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    active: boolean("active").default(true).notNull(),
    sortOrder: integer("sort_order").notNull(),
    ...authorship,
    ...timestamps,
  },
  (t) => [index("faqs_active_order_idx").on(t.active, t.sortOrder)],
);
