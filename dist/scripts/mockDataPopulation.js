"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
require("dotenv/config");
const db_1 = require("../db");
const ip_schema_1 = require("../schemas/ip.schema");
const url_schema_1 = require("../schemas/url.schema");
const port_schema_1 = require("../schemas/port.schema");
const constants_1 = require("../types/constants");
const logging_service_1 = require("../services/logging.service");
const db = db_1.database.db;
function randomMode(index) {
    return index % constants_1.MOCK_DATA_CONSTANTS.WHITELIST_MODULO === 0
        ? "whitelist"
        : "blacklist";
}
function generateIps(count) {
    const results = [];
    const edgeIps = ["0.0.0.0", "255.255.255.255", "127.0.0.1", "::1"];
    for (let i = 0; i < Math.min(edgeIps.length, count); i++) {
        results.push({
            ip: edgeIps[i],
            mode: randomMode(i),
            status: "success",
            active: i % 3 !== 0, // This could be extracted to a constant if needed
        });
    }
    for (let i = results.length; i < count; i++) {
        results.push({
            ip: faker_1.faker.internet.ip(),
            mode: randomMode(i),
            status: "success",
            active: faker_1.faker.datatype.boolean(),
        });
    }
    return results;
}
function generateUrls(count) {
    const results = [];
    const edgeUrls = [
        "http://localhost",
        "http://localhost:3000",
        "https://example.com",
        "http://sub.domain.co.uk",
    ];
    for (let i = 0; i < Math.min(edgeUrls.length, count); i++) {
        results.push({
            url: edgeUrls[i],
            mode: randomMode(i),
            status: "success",
            active: i % constants_1.MOCK_DATA_CONSTANTS.WHITELIST_MODULO === 0,
        });
    }
    for (let i = results.length; i < count; i++) {
        results.push({
            url: faker_1.faker.internet.url(),
            mode: randomMode(i),
            status: "success",
            active: faker_1.faker.datatype.boolean(),
        });
    }
    return results;
}
function generatePorts(count) {
    const results = [];
    const edgePorts = [1, 22, 80, 443, 1024, 49151, 65535];
    for (let i = 0; i < Math.min(edgePorts.length, count); i++) {
        results.push({
            port: edgePorts[i],
            mode: randomMode(i),
            status: "success",
            active: i % constants_1.MOCK_DATA_CONSTANTS.BLACKLIST_MODULO === 1,
        });
    }
    for (let i = results.length; i < count; i++) {
        results.push({
            port: faker_1.faker.number.int({
                min: constants_1.PORT_CONSTANTS.MIN_PORT,
                max: constants_1.PORT_CONSTANTS.MAX_PORT,
            }),
            mode: randomMode(i),
            status: "success",
            active: faker_1.faker.datatype.boolean(),
        });
    }
    return results;
}
async function main() {
    const ipData = generateIps(constants_1.MOCK_DATA_CONSTANTS.DEFAULT_COUNT);
    const urlData = generateUrls(constants_1.MOCK_DATA_CONSTANTS.DEFAULT_COUNT);
    const portData = generatePorts(constants_1.MOCK_DATA_CONSTANTS.DEFAULT_COUNT);
    await db
        .insert(ip_schema_1.ipRules)
        .values(ipData)
        .onConflictDoNothing({ target: [ip_schema_1.ipRules.ip] });
    await db
        .insert(url_schema_1.urlRules)
        .values(urlData)
        .onConflictDoNothing({ target: [url_schema_1.urlRules.url] });
    await db
        .insert(port_schema_1.portRules)
        .values(portData)
        .onConflictDoNothing({ target: [port_schema_1.portRules.port] });
    logging_service_1.loggingService.info("Mock data population completed", {
        ip_rules: ipData.length,
        url_rules: urlData.length,
        port_rules: portData.length,
    });
}
main().catch((err) => {
    const error = err;
    logging_service_1.loggingService.error("Mock data population failed", { error: error.message });
    process.exit(1);
});
