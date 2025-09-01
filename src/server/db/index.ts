// src/server/db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

declare global {
  var __dbPool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL!;
const pool = global.__dbPool ?? new Pool({ connectionString });

if (process.env.NODE_ENV !== 'production') {
  global.__dbPool = pool; 
}

export const db = drizzle(pool);
