import dotenv from "dotenv";
import { query } from "../src/db";

dotenv.config();

async function ensureRulesTables(): Promise<void> {
    await query(`
        CREATE TABLE IF NOT EXISTS ip_rules (
          id SERIAL PRIMARY KEY,
          ip INET NOT NULL,
          mode TEXT NOT NULL CHECK (mode IN ('whitelist','blacklist')),
          status TEXT NOT NULL DEFAULT 'success',
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          UNIQUE (ip, mode)
        );
    `);

    await query(`
        CREATE TABLE IF NOT EXISTS url_rules (
          id SERIAL PRIMARY KEY,
          url TEXT NOT NULL,
          mode TEXT NOT NULL CHECK (mode IN ('whitelist','blacklist')),
          status TEXT NOT NULL DEFAULT 'success',
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          UNIQUE (url, mode)
        );
    `);

    await query(`
        CREATE TABLE IF NOT EXISTS port_rules (
          id SERIAL PRIMARY KEY,
          port NUMERIC NOT NULL,
          mode TEXT NOT NULL CHECK (mode IN ('whitelist','blacklist')),
          status TEXT NOT NULL DEFAULT 'success',
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          UNIQUE (port, mode)
        );
    `);
}

async function main(): Promise<void> {
    await ensureRulesTables();
    console.log("Created ip, url, port tables");
}

main().catch(err => {
    console.error("SQL tables creation failed:", err);
    process.exit(1);
});