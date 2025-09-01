import * as zod from "zod";
import { PORT_CONSTANTS, ENVIRONMENTS } from "@/types/constants";

// Only load dotenv on the server side
if (typeof window === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const dotenv = require('dotenv');
  dotenv.config();
}

const EnvSchema = zod.object({
  ENV: zod.enum(ENVIRONMENTS).default("dev"),
  PORT: zod
    .string()
    .default("3001")
    .transform((val) => parseInt(val, 10))
    .refine(
      (val) => val > 0 && val < PORT_CONSTANTS.MAX_PORT_EXCLUSIVE,
      "PORT must be a valid port number"
    ),
  SERVER_URL: zod.string().url().default("http://localhost:3000"),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.format());
  console.warn("Using default environment configuration for development");
  // In development, we can continue with defaults
  if (process.env.NODE_ENV === 'production') {
    throw new Error("Invalid environment configuration");
  }
}

// Use parsed data or fallback to defaults
const envData = parsed.success ? parsed.data : {
  ENV: "dev" as const,
  PORT: 3001,
  SERVER_URL: "http://localhost:3000"
};

export const config = {
  env: envData.ENV,
  port: envData.PORT,
  serverUrl: envData.SERVER_URL,
  isDev: envData.ENV === "dev",
  isProd: envData.ENV === "production",
} as const;

export type AppConfig = typeof config;
