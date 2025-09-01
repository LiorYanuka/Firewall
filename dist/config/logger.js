"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const env_1 = require("./env");
const { combine, timestamp, printf, colorize, json, errors } = winston_1.default.format;
class LoggerSingleton {
    constructor() { } // private constructor prevents instantiation
    static getInstance() {
        if (!LoggerSingleton.instance) {
            const consoleFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
                const logMessage = stack || message;
                return `${timestamp} [${level}]: ${logMessage} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
            });
            const transports = env_1.config.env === "dev"
                ? [
                    new winston_1.default.transports.Console({
                        level: "debug",
                        format: combine(colorize(), timestamp(), errors({ stack: true }), consoleFormat),
                    }),
                ]
                : [
                    new winston_1.default.transports.File({
                        filename: "app.log",
                        level: "info",
                        format: combine(timestamp(), errors({ stack: true }), json()),
                    }),
                ];
            LoggerSingleton.instance = winston_1.default.createLogger({
                defaultMeta: { service: "firewall-service", env: env_1.config.env },
                transports,
            });
            try {
                LoggerSingleton.instance.info(`Logger initialized in ${env_1.config.env} environment`);
            }
            catch (e) {
                console.error("Logger failed to initialize", e);
            }
            // Override console
            console.log = (...args) => LoggerSingleton.instance.info(args
                .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
                .join(" "));
            console.warn = (...args) => LoggerSingleton.instance.warn(args
                .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
                .join(" "));
            console.error = (...args) => LoggerSingleton.instance.error(args
                .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
                .join(" "));
            console.debug = (...args) => LoggerSingleton.instance.debug(args
                .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
                .join(" "));
        }
        return LoggerSingleton.instance;
    }
}
exports.default = LoggerSingleton.getInstance();
