import { RuleType, ModeType } from "../types/rules";
import { isIP } from "net";
import { z } from "zod";


const ModeSchema = z.enum(["whitelist", "blacklist"]);

const PortSchema = z.preprocess(
  (v) => (typeof v === "string" && /^\d+$/.test(v) ? Number(v) : v),
  z.number().int().min(1).max(65535)
);

const UrlItemSchema = z.string().transform((s, ctx) => {
  try {
    const str = s.trim().toLowerCase();
    const withProto = /^(https?:)?\/\//i.test(str) ? str : `http://${str}`;
    const u = new URL(withProto);
    if (!u.hostname) throw new Error("Missing hostname");
    const host = u.port ? `${u.hostname}:${u.port}` : u.hostname;
    const pathname = u.pathname === "/" ? "" : u.pathname;
    const query = u.search ?? "";
    return `${host}${pathname}${query}`;
  } catch (e: any) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Invalid URL: ${e.message || String(e)}` });
    return z.NEVER;
  }
});

const IpItemSchema = z.string().trim().min(1).refine((v) => isIP(v) !== 0, { message: "Invalid IP address" });
const BaseSchema = z.object({
  mode: ModeSchema,
  values: z.array(z.any()).min(1, "`values` must be a non-empty array"),
});

const PortBodySchema = BaseSchema.extend({ values: z.array(PortSchema).min(1, "No valid ports provided") });
const UrlBodySchema = BaseSchema.extend({ values: z.array(UrlItemSchema).min(1, "No valid URLs provided") });
const IpBodySchema = BaseSchema.extend({ values: z.array(IpItemSchema).min(1, "No valid IPs provided") });


export class ValidationError extends Error {
    status = 400 as const;
    details?: unknown;
    constructor(message: string, details?: unknown) {
        super(message);
        this.name = "ValidationError";
        this.details = details;
    }
}

export const validateRules = (data: unknown, rule: "ip" | "url" | "port") => {
  const schema = rule === "ip" ? IpBodySchema : rule === "url" ? UrlBodySchema : PortBodySchema;
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError("Validation failed", result.error.flatten());
  }
  return result.data.values;
};