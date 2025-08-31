import winston from "winston";
import { config } from "./env";

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

class LoggerSingleton {
  private static instance: winston.Logger;

  private constructor() {} // private constructor prevents instantiation

  public static getInstance(): winston.Logger {
    if (!LoggerSingleton.instance) {
      const consoleFormat = printf(
        ({ level, message, timestamp, stack, ...meta }) => {
          const logMessage = stack || message;
          return `${timestamp} [${level}]: ${logMessage} ${
            Object.keys(meta).length ? JSON.stringify(meta) : ""
          }`;
        }
      );

      const transports: winston.transport[] =
        config.env === "dev"
          ? [
              new winston.transports.Console({
                level: "debug",
                format: combine(
                  colorize(),
                  timestamp(),
                  errors({ stack: true }),
                  consoleFormat
                ),
              }),
            ]
          : [
              new winston.transports.File({
                filename: "app.log",
                level: "info",
                format: combine(timestamp(), errors({ stack: true }), json()),
              }),
            ];

      LoggerSingleton.instance = winston.createLogger({
        defaultMeta: { service: "firewall-service", env: config.env },
        transports,
      });

      try {
        LoggerSingleton.instance.info(
          `Logger initialized in ${config.env} environment`
        );
      } catch (e) {
        console.error("Logger failed to initialize", e);
      }

      // Override console
      console.log = (...args: any[]) =>
        LoggerSingleton.instance.info(
          args
            .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
            .join(" ")
        );
      console.warn = (...args: any[]) =>
        LoggerSingleton.instance.warn(
          args
            .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
            .join(" ")
        );
      console.error = (...args: any[]) =>
        LoggerSingleton.instance.error(
          args
            .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
            .join(" ")
        );
      console.debug = (...args: any[]) =>
        LoggerSingleton.instance.debug(
          args
            .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
            .join(" ")
        );
    }

    return LoggerSingleton.instance;
  }
}

export default LoggerSingleton.getInstance();
