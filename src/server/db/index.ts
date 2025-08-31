// src/server/db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var __dbPool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL!;
const pool = global.__dbPool ?? new Pool({ connectionString });

if (process.env.NODE_ENV !== 'production') {
  global.__dbPool = pool; // reuse in dev to avoid creating many pools on HMR
}

export const db = drizzle(pool);
