import dotenv from "dotenv";
import { query } from "../src/db";

dotenv.config();

async function ensureIpRulesTable(): Promise<void> {
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
}

async function migrateFromLegacyIpTableIfPresent(): Promise<void> {
    const result = await query("SELECT to_regclass('public.ip') as tbl");
    const exists = result.rows?.[0]?.tbl !== null;
    if (!exists) return;

    // Detect the legacy array column name: either "values" or "value"
    const colInfo = await query(
        `SELECT column_name, data_type
         FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = 'ip'`
    );
    const columns: Array<{ column_name: string; data_type: string }> = colInfo.rows ?? [];
    const valuesCol = columns.find(c => c.column_name === 'values');
    const valueCol = columns.find(c => c.column_name === 'value');
    const arrayCol = valuesCol?.column_name || valueCol?.column_name;

    if (!arrayCol) {
        throw new Error("Legacy 'ip' table found, but neither 'values' nor 'value' column exists.");
    }

    // Insert one row per ip value for each mode from legacy table structure
    // Legacy schema expected: ip(mode text, <arrayCol> varchar[], status varchar, ...)
    const sql = `
        INSERT INTO ip_rules (ip, mode, status)
        SELECT v::inet, t.mode, COALESCE(t.status, 'success')
        FROM ip AS t
        CROSS JOIN UNNEST(t."${arrayCol}") AS v
        ON CONFLICT (ip, mode) DO NOTHING;
    `;
    await query(sql);
}

async function main(): Promise<void> {
    await ensureIpRulesTable();
    await migrateFromLegacyIpTableIfPresent();
    // eslint-disable-next-line no-console
    console.log("Migration completed (ip_rules ensured, legacy data migrated if present).");
}

main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Migration failed:", err);
    process.exit(1);
});


