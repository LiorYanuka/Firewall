import { APP_CONSTANTS } from "@/types/constants";

// Only import winston on the server side
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let winston: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let config: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let winstonFormat: any;

if (typeof window === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  winston = require('winston');
  winstonFormat = winston.format;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  config = require('./env').config;
} else {
  // Browser fallback
  config = {
    env: process.env.NEXT_PUBLIC_ENV || 'dev',
    isDev: (process.env.NEXT_PUBLIC_ENV || 'dev') === 'dev',
    isProd: (process.env.NEXT_PUBLIC_ENV || 'dev') === 'production'
  };
  winstonFormat = { combine: () => ({}), timestamp: () => ({}), printf: () => ({}), colorize: () => ({}), json: () => ({}), errors: () => ({}), simple: () => ({}) };
}

class LoggerSingleton {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static instance: any;

  private constructor() {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static getInstance(): any {
    if (!LoggerSingleton.instance) {
      if (typeof window === 'undefined') {
        // Server-side logging
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const consoleFormat = winstonFormat.printf(({ level, message, timestamp, stack, ...meta }: any) => {
          const logMessage = stack || message;
          const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
          return `${timestamp} [${level}]: ${logMessage}${metaString}`;
        });

        const consoleTransport = new winston.transports.Console({
          level: config.isProd ? "info" : "debug",
          format: winstonFormat.combine(
            config.isProd ? winstonFormat.simple() : winstonFormat.colorize(),
            winstonFormat.timestamp(),
            winstonFormat.errors({ stack: true }),
            consoleFormat
          ),
        });

        LoggerSingleton.instance = winston.createLogger({
          defaultMeta: { service: APP_CONSTANTS.SERVICE_NAME, env: config.env },
          transports: [consoleTransport],
          format: winstonFormat.combine(winstonFormat.timestamp(), winstonFormat.errors({ stack: true }), winstonFormat.json()),
        });
      } else {
        // Browser-side logging - simple console wrapper
        LoggerSingleton.instance = {
          info: (msg: string) => console.info(`[INFO] ${msg}`),
          warn: (msg: string) => console.warn(`[WARN] ${msg}`),
          error: (msg: string) => console.error(`[ERROR] ${msg}`),
          debug: (msg: string) => console.debug(`[DEBUG] ${msg}`)
        };
      }

      try {
        LoggerSingleton.instance.info(`Logger initialized in ${config.env} environment`);
      } catch (e) {
        console.error("Logger failed to initialize", e);
      }

      // Override console methods to route through logger
      const bind = (method: string) =>
        (...args: unknown[]) => {
          const callLogger = LoggerSingleton.instance[method];
          const message = args
            .map((a) => (typeof a === "string" ? a : (() => { try { return JSON.stringify(a); } catch { return String(a); } })()))
            .join(" ");
          callLogger(message);
        };

      console.log = bind("info");
      console.info = bind("info");
      console.warn = bind("warn");
      console.error = bind("error");
      console.debug = bind("debug");
    }

    return LoggerSingleton.instance;
  }
}

export default LoggerSingleton.getInstance();


