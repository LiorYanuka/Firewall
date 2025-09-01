"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processRules = void 0;
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const db_1 = require("../db");
const ip_schema_1 = require("../schemas/ip.schema");
const url_schema_1 = require("../schemas/url.schema");
const port_schema_1 = require("../schemas/port.schema");
const drizzle_orm_1 = require("drizzle-orm");
const processRules = async (data, rule, mode, action) => {
    const cleaned = (0, validationMiddleware_1.validateRules)({ values: data, mode }, rule);
    if (rule === "ip") {
        const ips = cleaned;
        if (action === "insert") {
            await db_1.db.insert(ip_schema_1.ipRules).values(ips.map((ip) => ({ ip, mode }))).onConflictDoNothing({ target: [ip_schema_1.ipRules.ip, ip_schema_1.ipRules.mode] });
        }
        else {
            await db_1.db.delete(ip_schema_1.ipRules).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.inArray)(ip_schema_1.ipRules.ip, ips), (0, drizzle_orm_1.eq)(ip_schema_1.ipRules.mode, mode)));
        }
    }
    if (rule === "url") {
        const urls = cleaned;
        if (action === "insert") {
            await db_1.db.insert(url_schema_1.urlRules).values(urls.map((url) => ({ url, mode }))).onConflictDoNothing({ target: [url_schema_1.urlRules.url, url_schema_1.urlRules.mode] });
        }
        else {
            await db_1.db.delete(url_schema_1.urlRules).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.inArray)(url_schema_1.urlRules.url, urls), (0, drizzle_orm_1.eq)(url_schema_1.urlRules.mode, mode)));
        }
    }
    if (rule === "port") {
        const ports = cleaned;
        if (action === "insert") {
            await db_1.db.insert(port_schema_1.portRules).values(ports.map((port) => ({ port, mode }))).onConflictDoNothing({ target: [port_schema_1.portRules.port, port_schema_1.portRules.mode] });
        }
        else {
            await db_1.db.delete(port_schema_1.portRules).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.inArray)(port_schema_1.portRules.port, ports), (0, drizzle_orm_1.eq)(port_schema_1.portRules.mode, mode)));
        }
    }
    console.log(`${rule.toUpperCase()} ${action.toUpperCase()} completed for ${cleaned.length} item(s).`);
};
exports.processRules = processRules;
