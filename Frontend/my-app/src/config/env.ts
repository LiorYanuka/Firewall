import * as zod from "zod";
import { PORT_CONSTANTS, ENVIRONMENTS } from "@/types/constants";

const isServer = typeof window === "undefined";

// Load .env on the server side only
if (isServer) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const dotenv = require("dotenv");
  dotenv.config();
}

// Server schema (strict) – used to gate startup
const ServerEnvSchema = zod.object({
  ENV: zod.enum(ENVIRONMENTS),
  PORT: zod.coerce
    .number()
    .int()
    .min(PORT_CONSTANTS.MIN_PORT, "PORT must be >= 1")
    .max(PORT_CONSTANTS.MAX_PORT, "PORT must be <= 65535"),
  SERVER_URL: zod.string().url("SERVER_URL must be a valid URL"),
});

// Client schema (public, optional) – compatible with Next.js
const ClientEnvSchema = zod.object({
  NEXT_PUBLIC_ENV: zod.enum(ENVIRONMENTS).optional(),
  NEXT_PUBLIC_SERVER_URL: zod.string().url().optional(),
});

let envData: {
  ENV: (typeof ENVIRONMENTS)[number];
  PORT: number;
  SERVER_URL: string;
};

if (isServer) {
  const parsedServer = ServerEnvSchema.safeParse(process.env);
  if (!parsedServer.success) {
    throw new Error("Environment validation failed. Fix your server env vars.");
  }
  envData = parsedServer.data;
} else {
  const parsedClient = ClientEnvSchema.safeParse(process.env);
  const publicEnv = parsedClient.success ? parsedClient.data : {};
  const browserOrigin =
    typeof window !== "undefined" ? window.location.origin : "";
  envData = {
    ENV: (publicEnv.NEXT_PUBLIC_ENV as (typeof ENVIRONMENTS)[number]) || "dev",
    PORT: 0,
    SERVER_URL:
      publicEnv.NEXT_PUBLIC_SERVER_URL ||
      browserOrigin ||
      "http://localhost:3000",
  };
}

// Derived configuration and constants
const DATABASES_BY_ENV = {
  dev: {
    databaseName: "firewall_dev",
    rulesTable: "rules_dev",
  },
  production: {
    databaseName: "firewall_prod",
    rulesTable: "rules",
  },
} as const;

export const CONFIG_STRINGS = {
  appName: "firewall-frontend",
  defaultRulesTable: "rules",
} as const;

export const config = {
  env: envData.ENV,
  port: envData.PORT,
  serverUrl: envData.SERVER_URL,
  isDev: envData.ENV === "dev",
  isProd: envData.ENV === "production",
  apiBaseUrl: envData.SERVER_URL,
  database: DATABASES_BY_ENV[envData.ENV],
} as const;

export type AppConfig = typeof config;
