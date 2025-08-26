import { Pool } from "pg";
import dotenv from "dotenv"
import { env } from "./config/env";


dotenv.config();

const pool = new Pool({
    user: env.user,
    host: env.host,
    database: env.database,
    password: env.password,
    port: env.port,
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};