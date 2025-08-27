import * as zod from "zod";
import dotenv from "dotenv";

dotenv.config();

const EnvSchema = zod.object({
    ENV: zod.enum(["dev", "production"]),
    PORT: zod.string().transform((val) => parseInt(val, 10)).refine((val) => val > 0 && val < 65536, "PORT must be a valid port number"),
    DATABASE_URI_DEV: zod.string().url(),
    DATABASE_URI_PROD: zod.string().url(),
    DB_CONNECTION_INTERVAL: zod.string()
        .transform((val) => parseInt(val, 10))
        .refine((val) => val > 0, "DB_CONNECTION_INTERVAL must be a positive number"),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.format());
    throw new Error("Invalid environment configuration");
}

const { ENV, PORT, DATABASE_URI_DEV, DATABASE_URI_PROD, DB_CONNECTION_INTERVAL } = parsed.data;

export const config = {
    env: ENV,
    port: PORT,
    databaseUri: ENV === "dev" ? DATABASE_URI_DEV : DATABASE_URI_PROD,
    connectionInterval: DB_CONNECTION_INTERVAL,
};