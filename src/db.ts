import { Pool } from "pg";
import { config } from "./config/env";
import { drizzle } from "drizzle-orm/node-postgres";


const pool = new Pool({
    connectionString: config.databaseUri,
});

async function connectWithRetry(attempt = 1): Promise<void> {
    const baseDelay = config.connectionInterval;
    const delay = Math.min(baseDelay * 2 ** (attempt - 1), 16000);

    try {
        await pool.query("SELECT 1");
        console.log("Database connected successfully");
    } catch (err) {
        console.error(`Database connection failed (attempt ${attempt}):`, (err as Error).message);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return connectWithRetry(attempt + 1);
    }
}

connectWithRetry();

export const query = (text: string, params?: any[]) => {
    return pool.query(text, params);
};

export const db = drizzle(pool);