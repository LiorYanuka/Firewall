import * as zod from "zod";

const EnvSchema = zod.object({
    PGUSER: zod.string().min(1, "PGUSER is required"),
    PGHOST: zod.string().min(1, "PGHOST is required"),
    PGDATABASE: zod.string().min(1, "PGDATABASE is required"),
    PGPASSWORD: zod.string().min(1, "PGPASSWORD is required"),
    PGPORT: zod.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val), "PGPORT must be a number"),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error);
  throw new Error("Invalid environment configuration");
}

export const env = {
    user: parsed.data.PGUSER,
    host: parsed.data.PGHOST,
    database: parsed.data.PGDATABASE,
    password: parsed.data.PGPASSWORD,
    port: parsed.data.PGPORT,
};
