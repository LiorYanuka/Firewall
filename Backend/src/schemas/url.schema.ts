import {
  pgTable,
  serial,
  text,
  boolean,
  integer,
  inet,
  unique,
  numeric,
} from "drizzle-orm/pg-core";

export const urlRules = pgTable(
  "url_rules",
  {
    id: serial("id").primaryKey(),
    url: text("url").notNull(),
    mode: text("mode").notNull(),
    status: text("status").notNull().default("success"),
    active: boolean("active").notNull().default(true),
  },
  (t) => ({
    uq: unique().on(t.url),
  })
);
