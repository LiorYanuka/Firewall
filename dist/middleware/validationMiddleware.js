"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRules = exports.ValidationError = void 0;
const net_1 = require("net");
const zod_1 = require("zod");
const ModeSchema = zod_1.z.enum(["whitelist", "blacklist"]);
const PortSchema = zod_1.z.preprocess((v) => (typeof v === "string" && /^\d+$/.test(v) ? Number(v) : v), zod_1.z.number().int().min(1).max(65535));
const UrlItemSchema = zod_1.z.string().transform((s, ctx) => {
    try {
        const str = s.trim().toLowerCase();
        const withProto = /^(https?:)?\/\//i.test(str) ? str : `http://${str}`;
        const u = new URL(withProto);
        if (!u.hostname)
            throw new Error("Missing hostname");
        const host = u.port ? `${u.hostname}:${u.port}` : u.hostname;
        const pathname = u.pathname === "/" ? "" : u.pathname;
        const query = u.search ?? "";
        return `${host}${pathname}${query}`;
    }
    catch (e) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: `Invalid URL: ${e.message || String(e)}` });
        return zod_1.z.NEVER;
    }
});
const IpItemSchema = zod_1.z.string().trim().min(1).refine((v) => (0, net_1.isIP)(v) !== 0, { message: "Invalid IP address" });
const BaseSchema = zod_1.z.object({
    mode: ModeSchema,
    values: zod_1.z.array(zod_1.z.any()).min(1, "`values` must be a non-empty array"),
});
const PortBodySchema = BaseSchema.extend({ values: zod_1.z.array(PortSchema).min(1, "No valid ports provided") });
const UrlBodySchema = BaseSchema.extend({ values: zod_1.z.array(UrlItemSchema).min(1, "No valid URLs provided") });
const IpBodySchema = BaseSchema.extend({ values: zod_1.z.array(IpItemSchema).min(1, "No valid IPs provided") });
class ValidationError extends Error {
    constructor(message, details) {
        super(message);
        this.status = 400;
        this.name = "ValidationError";
        this.details = details;
    }
}
exports.ValidationError = ValidationError;
const validateRules = (data, rule) => {
    const schema = rule === "ip" ? IpBodySchema : rule === "url" ? UrlBodySchema : PortBodySchema;
    const result = schema.safeParse(data);
    if (!result.success) {
        throw new ValidationError("Validation failed", result.error.flatten());
    }
    return result.data.values;
};
exports.validateRules = validateRules;
