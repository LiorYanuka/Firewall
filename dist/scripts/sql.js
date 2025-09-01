"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const db_1 = require("../db");
const constants_1 = require("../types/constants");
const logging_service_1 = require("../services/logging.service");
const pool = db_1.database.pool;
async function ensureRulesTables() {
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
async function main() {
    await ensureRulesTables();
    logging_service_1.loggingService.allTablesCreated();
}
main().catch((err) => {
    const error = err;
    logging_service_1.loggingService.error("SQL tables creation failed", { error: error.message });
    process.exit(constants_1.EXIT_CODES.ERROR);
});
