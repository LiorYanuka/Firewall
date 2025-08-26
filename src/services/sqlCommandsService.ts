import { query } from "../db";
import { validateRules } from "./validationService";

type RuleType = "port" | "url" | "ip";

export const insertRules = async (data: any, type: RuleType, mode: "whitelist" | "blacklist") => {
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
        const sql = type === "ip"
        ? `INSERT INTO ${table} (${column}, mode) VALUES ($1::inet, $2) ON CONFLICT (${column}, mode) DO NOTHING`
        : `INSERT INTO ${table} (${column}, mode) VALUES ($1, $2) ON CONFLICT (${column}, mode) DO NOTHING`;

        await query(sql, [item, mode]);
    }
    console.log(`${type.toUpperCase()} Proccessing`);
  
};