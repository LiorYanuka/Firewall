import { faker } from "@faker-js/faker";
import "dotenv/config";
import { db } from "../db";
import { ipRules } from "../schemas/ip.schema";
import { urlRules } from "../schemas/url.schema";
import { portRules } from "../schemas/port.schema";

type Mode = "whitelist" | "blacklist";

function randomMode(index: number): Mode {
  return index % 2 === 0 ? "whitelist" : "blacklist";
}

function generateIps(
  count: number
): { ip: string; mode: Mode; status: string; active: boolean }[] {
  const results: { ip: string; mode: Mode; status: string; active: boolean }[] =
    [];

  // Edge cases
  const edgeIps = ["0.0.0.0", "255.255.255.255", "127.0.0.1", "::1"];
  for (let i = 0; i < Math.min(edgeIps.length, count); i++) {
    results.push({
      ip: edgeIps[i],
      mode: randomMode(i),
      status: "success",
      active: i % 3 !== 0,
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

function generateUrls(
  count: number
): { url: string; mode: Mode; status: string; active: boolean }[] {
  const results: {
    url: string;
    mode: Mode;
    status: string;
    active: boolean;
  }[] = [];

  // Edge-ish valid URLs
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
      active: i % 2 === 0,
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

function generatePorts(
  count: number
): { port: number; mode: Mode; status: string; active: boolean }[] {
  const results: {
    port: number;
    mode: Mode;
    status: string;
    active: boolean;
  }[] = [];

  // Edge port numbers within valid range
  const edgePorts = [1, 22, 80, 443, 1024, 49151, 65535];
  for (let i = 0; i < Math.min(edgePorts.length, count); i++) {
    results.push({
      port: edgePorts[i],
      mode: randomMode(i),
      status: "success",
      active: i % 2 === 1,
    });
  }

  for (let i = results.length; i < count; i++) {
    // Valid port: 1..65535
    const port = faker.number.int({ min: 1, max: 65535 });
    results.push({
      port,
      mode: randomMode(i),
      status: "success",
      active: faker.datatype.boolean(),
    });
  }

  return results;
}

async function main() {
  const ipData = generateIps(10);
  const urlData = generateUrls(10);
  const portData = generatePorts(10);

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
