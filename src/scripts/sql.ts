import "dotenv/config";
import { database } from "../db";
import { EXIT_CODES } from "../types/constants";
import { loggingService } from "../services/logging.service";

const pool = database.pool;

async function ensureRulesTables(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ip_rules (
      id SERIAL PRIMARY KEY,
      ip INET NOT NULL,
      mode TEXT NOT NULL CHECK (mode IN ('whitelist','blacklist')),
      status TEXT NOT NULL DEFAULT 'success',
      active BOOLEAN NOT NULL DEFAULT TRUE,
      UNIQUE (ip)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS url_rules (
      id SERIAL PRIMARY KEY,
      url TEXT NOT NULL,
      mode TEXT NOT NULL CHECK (mode IN ('whitelist','blacklist')),
      status TEXT NOT NULL DEFAULT 'success',
      active BOOLEAN NOT NULL DEFAULT TRUE,
      UNIQUE (url)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS port_rules (
      id SERIAL PRIMARY KEY,
      port NUMERIC NOT NULL,
      mode TEXT NOT NULL CHECK (mode IN ('whitelist','blacklist')),
      status TEXT NOT NULL DEFAULT 'success',
      active BOOLEAN NOT NULL DEFAULT TRUE,
      UNIQUE (port)
    );
  `);
}

async function main(): Promise<void> {
  await ensureRulesTables();
  loggingService.allTablesCreated();
}

main().catch((err) => {
  const error = err as Error;
  loggingService.error("SQL tables creation failed", { error: error.message });
  process.exit(EXIT_CODES.ERROR);
});
