import { RuleType } from "../types/rules";
import { isIP } from "net";
import { z } from "zod";
import {
  PORT_CONSTANTS,
  VALIDATION_CONSTANTS,
  HTTP_STATUS,
} from "../types/constants";

const ModeSchema = z.enum(["whitelist", "blacklist"]);

const PortSchema = z.preprocess(
  (v) => (typeof v === "string" && /^\d+$/.test(v) ? Number(v) : v),
  z.number().int().min(PORT_CONSTANTS.MIN_PORT).max(PORT_CONSTANTS.MAX_PORT)
);

const UrlItemSchema = z.string().transform((s, ctx) => {
  try {
    const str = s.trim().toLowerCase();
    const withProto = /^(https?:)?\/\//i.test(str) ? str : `https://${str}`;
    const u = new URL(withProto);
    if (!u.hostname) throw new Error("Missing hostname");
    const url = u.toString();
    return url.endsWith("/") ? url.slice(0, -1) : url;
  } catch (e: unknown) {
    const error = e as Error;
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid URL: ${error.message}`,
    });
    return z.NEVER;
  }
});

const IpItemSchema = z
  .string()
  .trim()
  .refine((v) => isIP(v) !== 0, { message: "Invalid IP address" });

const BaseSchema = z.object({
  mode: ModeSchema,
  values: z
    .array(z.any())
    .min(
      VALIDATION_CONSTANTS.MIN_ARRAY_LENGTH,
      "`values` must be a non-empty array"
    ),
});

const Schemas = {
  ip: BaseSchema.extend({
    values: z
      .array(IpItemSchema)
      .min(VALIDATION_CONSTANTS.MIN_ARRAY_LENGTH, "No valid IPs provided"),
  }),
  url: BaseSchema.extend({
    values: z
      .array(UrlItemSchema)
      .min(VALIDATION_CONSTANTS.MIN_ARRAY_LENGTH, "No valid URLs provided"),
  }),
  port: BaseSchema.extend({
    values: z
      .array(PortSchema)
      .min(VALIDATION_CONSTANTS.MIN_ARRAY_LENGTH, "No valid ports provided"),
  }),
};

export class ValidationError extends Error {
  status = HTTP_STATUS.BAD_REQUEST;
  details?: unknown;
  constructor(message: string, details?: unknown) {
    super(message);
    this.name = "ValidationError";
    this.details = details;
  }
}

export const validateRules = (data: unknown, rule: RuleType) => {
  const result = Schemas[rule].safeParse(data);
  if (!result.success)
    throw new ValidationError("Validation failed", result.error.flatten());
  return result.data.values;
};
