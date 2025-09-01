"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const zod = __importStar(require("zod"));
const dotenv_1 = __importDefault(require("dotenv"));
const constants_1 = require("../types/constants");
dotenv_1.default.config();
const EnvSchema = zod.object({
    ENV: zod.enum(["dev", "production"]),
    PORT: zod
        .string()
        .transform((val) => parseInt(val, 10))
        .refine((val) => val > 0 && val < constants_1.PORT_CONSTANTS.MAX_PORT_EXCLUSIVE, "PORT must be a valid port number"),
    DATABASE_URI_DEV: zod.string().url(),
    DATABASE_URI_PROD: zod.string().url(),
    DB_CONNECTION_INTERVAL: zod
        .string()
        .transform((val) => parseInt(val, 10))
        .refine((val) => val > 0, "DB_CONNECTION_INTERVAL must be a positive number"),
});
const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.format());
    throw new Error("Invalid environment configuration");
}
const { ENV, PORT, DATABASE_URI_DEV, DATABASE_URI_PROD, DB_CONNECTION_INTERVAL, } = parsed.data;
exports.config = {
    env: ENV,
    port: PORT,
    databaseUri: ENV === "dev" ? DATABASE_URI_DEV : DATABASE_URI_PROD,
    connectionInterval: DB_CONNECTION_INTERVAL,
};
