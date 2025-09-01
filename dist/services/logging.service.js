"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggingService = void 0;
const logger_1 = __importDefault(require("../config/logger"));
class LoggingService {
    // Basic logging methods
    error(message, context) {
        logger_1.default.error(message, context);
    }
    warn(message, context) {
        logger_1.default.warn(message, context);
    }
    info(message, context) {
        logger_1.default.info(message, context);
    }
    debug(message, context) {
        logger_1.default.debug(message, context);
    }
    // Specialized logging methods - simplified
    request(context) {
        const { method, url, status, duration } = context;
        logger_1.default.info(`${method} ${url} - ${status} (${duration})`);
    }
    database(context) {
        const { operation, table, count, error, attempt } = context;
        if (error) {
            logger_1.default.error(`DB ${operation} failed: ${error}`);
        }
        else if (count) {
            logger_1.default.info(`DB ${operation} ${table}: ${count} records`);
        }
        else if (attempt) {
            logger_1.default.info(`DB ${operation} attempt ${attempt}`);
        }
        else {
            logger_1.default.info(`DB ${operation}`);
        }
    }
    rule(context) {
        const { type, action, count, status } = context;
        if (status === "failed") {
            logger_1.default.error(`${type.toUpperCase()} ${action} failed`);
        }
        else {
            logger_1.default.info(`${type.toUpperCase()} ${action}: ${count} items`);
        }
    }
    validation(context) {
        const { rule, errors, validatedCount } = context;
        if (errors) {
            logger_1.default.warn(`Validation failed for ${rule}`);
        }
        else {
            logger_1.default.debug(`Validation passed for ${rule}: ${validatedCount} items`);
        }
    }
    appError(context) {
        const { error, method, url } = context;
        logger_1.default.error(`${method} ${url} - ${error}`);
    }
    // Minimal convenience methods
    healthCheck() {
        logger_1.default.info("Health check");
    }
    serverStart(port, env) {
        logger_1.default.info(`Server started on port ${port} (${env})`);
    }
    mockDataGenerated(type, count) {
        logger_1.default.info(`Generated ${count} ${type} records`);
    }
    mockDataInserted(type, count) {
        logger_1.default.info(`Inserted ${count} ${type} records`);
    }
    tableCreated(table) {
        logger_1.default.info(`Table created: ${table}`);
    }
    allTablesCreated() {
        logger_1.default.info("All tables created");
    }
}
// Export singleton instance
exports.loggingService = new LoggingService();
