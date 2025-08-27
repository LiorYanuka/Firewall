import { pgTable, serial, text, boolean, integer, inet, unique, numeric } from 'drizzle-orm/pg-core';

export const ipRules = pgTable('ip_rules', {
	id: serial('id').primaryKey(),
	ip: inet('ip').notNull(),
	mode: text('mode').notNull(),
	status: text('status').notNull().default('success'),
	active: boolean('active').notNull().default(true),
}, (t) => ({
	uq: unique().on(t.ip, t.mode),
}));

export const urlRules = pgTable('url_rules', {
	id: serial('id').primaryKey(),
	url: text('url').notNull(),
	mode: text('mode').notNull(),
	status: text('status').notNull().default('success'),
	active: boolean('active').notNull().default(true),
}, (t) => ({
	uq: unique().on(t.url, t.mode),
}));

export const portRules = pgTable('port_rules', {
	id: serial('id').primaryKey(),
	port: numeric('port').notNull().$type<number>(),
	mode: text('mode').notNull(),
	status: text('status').notNull().default('success'),
	active: boolean('active').notNull().default(true),
}, (t) => ({
	uq: unique().on(t.port, t.mode),
}));