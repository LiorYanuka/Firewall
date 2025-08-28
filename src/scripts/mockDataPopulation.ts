import { faker } from "@faker-js/faker";
import "dotenv/config";
import { database } from "../db";
import { ipRules } from "../schemas/ip.schema";
import { urlRules } from "../schemas/url.schema";
import { portRules } from "../schemas/port.schema";
import { MOCK_DATA_CONSTANTS, PORT_CONSTANTS } from "../types/constants";

const db = database.db;

type Mode = "whitelist" | "blacklist";

function randomMode(index: number): Mode {
  return index % MOCK_DATA_CONSTANTS.WHITELIST_MODULO === 0 ? "whitelist" : "blacklist";
}

function generateIps(count: number) {
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
      ip: faker.internet.ip(),
      mode: randomMode(i),
      status: "success",
      active: faker.datatype.boolean(),
    });
  }

  return results;
}

function generateUrls(count: number) {
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
      active: i % MOCK_DATA_CONSTANTS.WHITELIST_MODULO === 0,
    });
  }

  for (let i = results.length; i < count; i++) {
    results.push({
      url: faker.internet.url(),
      mode: randomMode(i),
      status: "success",
      active: faker.datatype.boolean(),
    });
  }

  return results;
}

function generatePorts(count: number) {
  const results = [];

  const edgePorts = [1, 22, 80, 443, 1024, 49151, 65535];
  for (let i = 0; i < Math.min(edgePorts.length, count); i++) {
    results.push({
      port: edgePorts[i],
      mode: randomMode(i),
      status: "success",
      active: i % MOCK_DATA_CONSTANTS.BLACKLIST_MODULO === 1,
    });
  }

  for (let i = results.length; i < count; i++) {
    results.push({
      port: faker.number.int({ min: PORT_CONSTANTS.MIN_PORT, max: PORT_CONSTANTS.MAX_PORT }),
      mode: randomMode(i),
      status: "success",
      active: faker.datatype.boolean(),
    });
  }

  return results;
}

async function main() {
  const ipData = generateIps(MOCK_DATA_CONSTANTS.DEFAULT_COUNT);
  const urlData = generateUrls(MOCK_DATA_CONSTANTS.DEFAULT_COUNT);
  const portData = generatePorts(MOCK_DATA_CONSTANTS.DEFAULT_COUNT);

  await db
    .insert(ipRules)
    .values(ipData)
    .onConflictDoNothing({ target: [ipRules.ip, ipRules.mode] });
  await db
    .insert(urlRules)
    .values(urlData)
    .onConflictDoNothing({ target: [urlRules.url, urlRules.mode] });
  await db
    .insert(portRules)
    .values(portData)
    .onConflictDoNothing({ target: [portRules.port, portRules.mode] });

  console.log("Inserted mock data:", {
    ip_rules: ipData.length,
    url_rules: urlData.length,
    port_rules: portData.length,
  });
}

main().catch((err) => {
  console.error("Mock data population failed:", err);
  process.exit(1);
});
