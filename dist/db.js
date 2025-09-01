"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const pg_1 = require("pg");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const env_1 = require("./config/env");
const constants_1 = require("./types/constants");
const logging_service_1 = require("./services/logging.service");
class Database {
    constructor() {
        this.pool = new pg_1.Pool({ connectionString: env_1.config.databaseUri });
        this.db = (0, node_postgres_1.drizzle)(this.pool); // type inferred as NodePgDatabase
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    async connectWithRetry(attempt = 1) {
        const baseDelay = env_1.config.connectionInterval;
        const delay = Math.min(baseDelay * 2 ** (attempt - 1), constants_1.DB_CONSTANTS.MAX_RETRY_DELAY_MS);
        try {
            await this.pool.query(constants_1.DB_CONSTANTS.HEALTH_CHECK_QUERY);
            logging_service_1.loggingService.database({
                operation: "connect",
                attempt,
            });
        }
        catch (err) {
            const error = err;
            logging_service_1.loggingService.database({
                operation: "connect",
                attempt,
                error: error.message,
            });
            await new Promise((resolve) => setTimeout(resolve, delay));
            return this.connectWithRetry(attempt + 1);
        }
    }
    async endPool() {
        await this.pool.end();
    }
}
// Export singleton
exports.database = Database.getInstance();
