"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processRules = void 0;
const validation_middleware_1 = require("../middleware/validation.middleware");
const db_1 = require("../db");
const ip_schema_1 = require("../schemas/ip.schema");
const url_schema_1 = require("../schemas/url.schema");
const port_schema_1 = require("../schemas/port.schema");
const drizzle_orm_1 = require("drizzle-orm");
const db = db_1.database.db;
const handlers = {
    ip: {
        insert: async (values, mode) => {
            const ipValues = values;
            await db
                .insert(ip_schema_1.ipRules)
                .values(ipValues.map((ip) => ({ ip, mode })))
                .onConflictDoNothing({ target: [ip_schema_1.ipRules.ip] });
        },
        remove: async (values, mode) => {
            const ipValues = values;
            await db
                .delete(ip_schema_1.ipRules)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.inArray)(ip_schema_1.ipRules.ip, ipValues), (0, drizzle_orm_1.eq)(ip_schema_1.ipRules.mode, mode)));
        },
    },
    url: {
        insert: async (values, mode) => {
            const urlValues = values;
            await db
                .insert(url_schema_1.urlRules)
                .values(urlValues.map((url) => ({ url, mode })))
                .onConflictDoNothing({ target: [url_schema_1.urlRules.url] });
        },
        remove: async (values, mode) => {
            const urlValues = values;
            await db
                .delete(url_schema_1.urlRules)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.inArray)(url_schema_1.urlRules.url, urlValues), (0, drizzle_orm_1.eq)(url_schema_1.urlRules.mode, mode)));
        },
    },
    port: {
        insert: async (values, mode) => {
            const portValues = values;
            await db
                .insert(port_schema_1.portRules)
                .values(portValues.map((port) => ({ port, mode })))
                .onConflictDoNothing({ target: [port_schema_1.portRules.port] });
        },
        remove: async (values, mode) => {
            const portValues = values;
            await db
                .delete(port_schema_1.portRules)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.inArray)(port_schema_1.portRules.port, portValues), (0, drizzle_orm_1.eq)(port_schema_1.portRules.mode, mode)));
        },
    },
};
const processRules = async (data, rule, mode, action) => {
    const cleaned = (0, validation_middleware_1.validateRules)({ values: data, mode }, rule);
    const handler = handlers[rule];
    if (action === "insert") {
        await handler.insert(cleaned, mode);
    }
    else {
        await handler.remove(cleaned, mode);
    }
};
exports.processRules = processRules;
