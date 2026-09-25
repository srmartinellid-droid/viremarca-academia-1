import { text, timestamp } from "drizzle-orm/pg-core";

/** created_at / updated_at padrão. `updated_at` também é mantido por trigger no banco. */
export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

/** Autoria de conteúdo editado no admin (id do usuário do Better Auth). */
export const authorship = {
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
};
