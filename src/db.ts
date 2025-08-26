import { Pool } from "pg";
import { config } from "./config/env";

const pool = new Pool({
    connectionString: config.databaseUri,
});

export const query = (text: string, params?: any[]) => {
    return pool.query(text, params);
};
