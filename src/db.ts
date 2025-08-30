import { Pool } from "pg";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { config } from "./config/env";
import { DB_CONSTANTS } from "./types/constants";
import { loggingService } from "./services/logging.service";

class Database {
  private static instance: Database;
  public pool: Pool;
  public db: NodePgDatabase;

  private constructor() {
    this.pool = new Pool({ connectionString: config.databaseUri });
    this.db = drizzle(this.pool); // type inferred as NodePgDatabase
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connectWithRetry(attempt = 1): Promise<void> {
    const baseDelay = config.connectionInterval;
    const delay = Math.min(
      baseDelay * 2 ** (attempt - 1),
      DB_CONSTANTS.MAX_RETRY_DELAY_MS
    );

    try {
      await this.pool.query(DB_CONSTANTS.HEALTH_CHECK_QUERY);
      loggingService.database({
        operation: "connect",
        attempt,
      });
    } catch (err) {
      const error = err as Error;
      loggingService.database({
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
export const database = Database.getInstance();
