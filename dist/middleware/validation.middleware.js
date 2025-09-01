"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRules = exports.ValidationError = void 0;
const net_1 = require("net");
const zod_1 = require("zod");
const constants_1 = require("../types/constants");
const ModeSchema = zod_1.z.enum(["whitelist", "blacklist"]);
const PortSchema = zod_1.z.preprocess((v) => (typeof v === "string" && /^\d+$/.test(v) ? Number(v) : v), zod_1.z.number().int().min(constants_1.PORT_CONSTANTS.MIN_PORT).max(constants_1.PORT_CONSTANTS.MAX_PORT));
const UrlItemSchema = zod_1.z.string().transform((s, ctx) => {
    try {
        const str = s.trim().toLowerCase();
        const withProto = /^(https?:)?\/\//i.test(str) ? str : `https://${str}`;
        const u = new URL(withProto);
        if (!u.hostname)
            throw new Error("Missing hostname");
        const url = u.toString();
        return url.endsWith("/") ? url.slice(0, -1) : url;
    }
    catch (e) {
        const error = e;
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: `Invalid URL: ${error.message}`,
        });
        return zod_1.z.NEVER;
    }
});
const IpItemSchema = zod_1.z
    .string()
    .trim()
    .refine((v) => (0, net_1.isIP)(v) !== 0, { message: "Invalid IP address" });
const BaseSchema = zod_1.z.object({
    mode: ModeSchema,
    values: zod_1.z
        .array(zod_1.z.any())
        .min(constants_1.VALIDATION_CONSTANTS.MIN_ARRAY_LENGTH, "`values` must be a non-empty array"),
});
const Schemas = {
    ip: BaseSchema.extend({
        values: zod_1.z
            .array(IpItemSchema)
            .min(constants_1.VALIDATION_CONSTANTS.MIN_ARRAY_LENGTH, "No valid IPs provided"),
    }),
    url: BaseSchema.extend({
        values: zod_1.z
            .array(UrlItemSchema)
            .min(constants_1.VALIDATION_CONSTANTS.MIN_ARRAY_LENGTH, "No valid URLs provided"),
    }),
    port: BaseSchema.extend({
        values: zod_1.z
            .array(PortSchema)
            .min(constants_1.VALIDATION_CONSTANTS.MIN_ARRAY_LENGTH, "No valid ports provided"),
    }),
};
class ValidationError extends Error {
    constructor(message, details) {
        super(message);
        this.status = constants_1.HTTP_STATUS.BAD_REQUEST;
        this.name = "ValidationError";
        this.details = details;
    }
}
exports.ValidationError = ValidationError;
const validateRules = (data, rule) => {
    const result = Schemas[rule].safeParse(data);
    if (!result.success) {
        throw new ValidationError("Validation failed", result.error.flatten());
    }
    return result.data.values;
};
exports.validateRules = validateRules;
