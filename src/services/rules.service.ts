import { database } from "../db";
import { ipRules } from "../schemas/ip.schema";
import { urlRules } from "../schemas/url.schema";
import { portRules } from "../schemas/port.schema";
import { eq } from "drizzle-orm";
import { RuleType, RuleMapEntry, UpdatedRule } from "../types/rules";
import { ARRAY_INDICES } from "../types/constants";

const db = database.db;

const ruleMap: Record<RuleType, RuleMapEntry> = {
  ip: { table: ipRules, column: "ip" },
  url: { table: urlRules, column: "url" },
  port: { table: portRules, column: "port" },
};

export const getAllRules = async () => {
  const queries = Object.entries(ruleMap).flatMap(([type, { table }]) => [
    db
      .select({ id: table.id, value: table[ruleMap[type as RuleType].column] })
      .from(table)
      .where(eq(table.mode, "blacklist")),
    db
      .select({ id: table.id, value: table[ruleMap[type as RuleType].column] })
      .from(table)
      .where(eq(table.mode, "whitelist")),
  ]);

  const results = await Promise.all(queries);

  return {
    ip: {
      blacklist: results[ARRAY_INDICES.IP_BLACKLIST],
      whitelist: results[ARRAY_INDICES.IP_WHITELIST],
    },
    url: {
      blacklist: results[ARRAY_INDICES.URL_BLACKLIST],
      whitelist: results[ARRAY_INDICES.URL_WHITELIST],
    },
    port: {
      blacklist: results[ARRAY_INDICES.PORT_BLACKLIST],
      whitelist: results[ARRAY_INDICES.PORT_WHITELIST],
    },
  };
};

export const updateRuleActiveStatus = async (
  type: RuleType,
  values: (string | number)[],
  active: boolean
): Promise<UpdatedRule[]> => {
  const { table, column } = ruleMap[type];
  const updated: UpdatedRule[] = [];

  for (const val of values) {
    const rows = await db
      .update(table)
      .set({ active })
      .where(eq(table[column], val))
      .returning({
        id: table.id,
        [column]: table[column],
        active: table.active,
      });

    if (rows.length) updated.push(rows[0]);
  }

  return updated;
};
