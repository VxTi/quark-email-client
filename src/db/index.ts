import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import path from 'path';
import pg from 'pg';
import * as schema from './schema';

config({ path: path.resolve(process.cwd(), '.env.local'), quiet: true });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
