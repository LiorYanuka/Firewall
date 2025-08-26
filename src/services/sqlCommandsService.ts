import { query } from "../db";
import { validateRules } from "./validationService";

type RuleType = "port" | "url" | "ip";
type ActionType = "insert" | "delete";

export const processRules = async (
  data: any,
  type: RuleType,
  mode: "whitelist" | "blacklist",
  action: ActionType) => {
  const cleaned = validateRules({ values: data, mode }, type);

  let table = "";
  let column = "";

  switch (type) {
    case "port":
      table = "port_rules";
      column = "port";
      break;
    case "url":
      table = "url_rules";
      column = "url";
      break;
    case "ip":
      table = "ip_rules";
      column = "ip";
      break;
  }

  for (const item of cleaned) {
    let sql: string;

    if (action === "insert") {
      sql =
        type === "ip"
          ? `INSERT INTO ${table} (${column}, mode) VALUES ($1::inet, $2) ON CONFLICT (${column}, mode) DO NOTHING`
          : `INSERT INTO ${table} (${column}, mode) VALUES ($1, $2) ON CONFLICT (${column}, mode) DO NOTHING`;
    } 
    else {
      sql =
        type === "ip"
          ? `DELETE FROM ${table} WHERE ${column} = $1::inet AND mode = $2`
          : `DELETE FROM ${table} WHERE ${column} = $1 AND mode = $2`;
    }

    await query(sql, [item, mode]);
  }

  console.log(`${type.toUpperCase()} ${action.toUpperCase()} completed for ${cleaned.length} item(s).`);
};
