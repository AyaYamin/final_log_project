import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "../config/config.js";

export const client = postgres(
    config.db.url,
    {
        max: 20,

        // Close idle connections after 30 seconds
        idle_timeout: 30,

        // Fail if connection cannot be established quickly
        connect_timeout: 10,

        // Recycle connections periodically
        max_lifetime: 60 * 30,
    }
);

export const db = drizzle(client);

export async function checkDatabase() {
    await client`SELECT 1`;
}