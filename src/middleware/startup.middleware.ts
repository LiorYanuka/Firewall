import { Express, Request, Response, NextFunction } from "express";
import { config } from "../config/env";
import { loggingService } from "../services/logging.service";
import { database } from "../db";

export interface StartupOptions {
  port?: number;
  env?: string;
  enableRequestLogging?: boolean;
}

export function requestLoggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    loggingService.request({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
}

export async function setupServer(
  app: Express,
  options: StartupOptions = {}
): Promise<void> {
  const {
    port = config.port,
    env = config.env,
    enableRequestLogging = true,
  } = options;

  try {
    // Connect to database
    await database.connectWithRetry();

    // Start server
    app.listen(port, () => {
      loggingService.serverStart(port, env);
    });
  } catch (error) {
    loggingService.error("Failed to start server", { error: String(error) });
    process.exit(1);
  }
}
