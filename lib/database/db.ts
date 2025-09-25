// lib/database/db.ts
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL!; // ví dụ: postgres://user:pass@host:5432/db

// Reuse trong dev (HMR) & prod
declare global { // for dev hot-reload
  var __pgPool: Pool | undefined;
}

if (!global.__pgPool) {
  global.__pgPool = new Pool({
    connectionString,
    max: 10,         // tuỳ tải
    idleTimeoutMillis: 30_000,
    ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : undefined,
  });
}
const pool = global.__pgPool;

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
  pool,
};
