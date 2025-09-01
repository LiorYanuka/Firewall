"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRuleActiveStatus = exports.getAllRules = void 0;
const db_1 = require("../db");
const ip_schema_1 = require("../schemas/ip.schema");
const url_schema_1 = require("../schemas/url.schema");
const port_schema_1 = require("../schemas/port.schema");
const drizzle_orm_1 = require("drizzle-orm");
const constants_1 = require("../types/constants");
const db = db_1.database.db;
const ruleMap = {
    ip: { table: ip_schema_1.ipRules, column: "ip" },
    url: { table: url_schema_1.urlRules, column: "url" },
    port: { table: port_schema_1.portRules, column: "port" },
};
const getAllRules = async () => {
    const queries = Object.entries(ruleMap).flatMap(([type, { table }]) => [
        db
            .select({ id: table.id, value: table[ruleMap[type].column] })
            .from(table)
            .where((0, drizzle_orm_1.eq)(table.mode, "blacklist")),
        db
            .select({ id: table.id, value: table[ruleMap[type].column] })
            .from(table)
            .where((0, drizzle_orm_1.eq)(table.mode, "whitelist")),
    ]);
    const results = await Promise.all(queries);
    return {
        ip: {
            blacklist: results[constants_1.ARRAY_INDICES.IP_BLACKLIST],
            whitelist: results[constants_1.ARRAY_INDICES.IP_WHITELIST],
        },
        url: {
            blacklist: results[constants_1.ARRAY_INDICES.URL_BLACKLIST],
            whitelist: results[constants_1.ARRAY_INDICES.URL_WHITELIST],
        },
        port: {
            blacklist: results[constants_1.ARRAY_INDICES.PORT_BLACKLIST],
            whitelist: results[constants_1.ARRAY_INDICES.PORT_WHITELIST],
        },
    };
};
exports.getAllRules = getAllRules;
const updateRuleActiveStatus = async (type, values, active) => {
    const { table, column } = ruleMap[type];
    const updated = [];
    for (const val of values) {
        const rows = await db
            .update(table)
            .set({ active })
            .where((0, drizzle_orm_1.eq)(table[column], val))
            .returning({
            id: table.id,
            [column]: table[column],
            active: table.active,
        });
        if (rows.length)
            updated.push(rows[0]);
    }
    return updated;
};
exports.updateRuleActiveStatus = updateRuleActiveStatus;
