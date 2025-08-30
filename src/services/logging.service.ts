import logger from "../config/logger";
import {
  ILoggingService,
  LogContext,
  RequestLogContext,
  DatabaseLogContext,
  RuleLogContext,
  ValidationLogContext,
  ErrorLogContext,
} from "../types/logging";

class LoggingService implements ILoggingService {
  // Basic logging methods
  error(message: string, context?: LogContext): void {
    logger.error(message, context);
  }

  warn(message: string, context?: LogContext): void {
    logger.warn(message, context);
  }

  info(message: string, context?: LogContext): void {
    logger.info(message, context);
  }

  debug(message: string, context?: LogContext): void {
    logger.debug(message, context);
  }

  // Specialized logging methods - simplified
  request(context: RequestLogContext): void {
    const { method, url, status, duration } = context;
    logger.info(`${method} ${url} - ${status} (${duration})`);
  }

  database(context: DatabaseLogContext): void {
    const { operation, table, count, error, attempt } = context;

    if (error) {
      logger.error(`DB ${operation} failed: ${error}`);
    } else if (count) {
      logger.info(`DB ${operation} ${table}: ${count} records`);
    } else if (attempt) {
      logger.info(`DB ${operation} attempt ${attempt}`);
    } else {
      logger.info(`DB ${operation}`);
    }
  }

  rule(context: RuleLogContext): void {
    const { type, action, count, status } = context;

    if (status === "failed") {
      logger.error(`${type.toUpperCase()} ${action} failed`);
    } else {
      logger.info(`${type.toUpperCase()} ${action}: ${count} items`);
    }
  }

  validation(context: ValidationLogContext): void {
    const { rule, errors, validatedCount } = context;

    if (errors) {
      logger.warn(`Validation failed for ${rule}`);
    } else {
      logger.debug(`Validation passed for ${rule}: ${validatedCount} items`);
    }
  }

  appError(context: ErrorLogContext): void {
    const { error, method, url } = context;
    logger.error(`${method} ${url} - ${error}`);
  }

  // Minimal convenience methods
  healthCheck(): void {
    logger.info("Health check");
  }

  serverStart(port: number, env: string): void {
    logger.info(`Server started on port ${port} (${env})`);
  }

  mockDataGenerated(type: string, count: number): void {
    logger.info(`Generated ${count} ${type} records`);
  }

  mockDataInserted(type: string, count: number): void {
    logger.info(`Inserted ${count} ${type} records`);
  }

  tableCreated(table: string): void {
    logger.info(`Table created: ${table}`);
  }

  allTablesCreated(): void {
    logger.info("All tables created");
  }
}

// Export singleton instance
export const loggingService = new LoggingService();
