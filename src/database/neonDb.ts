// ///////////////////////////////////////////////////////////////////////
// // Neon Connection
// ///////////////////////////////////////////////////////////////////////
// Pool Connection
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from './schemas';
import dotenv from 'dotenv';

neonConfig.webSocketConstructor = ws;  // <-- this is the key bit

// Load environment variables from .env file
dotenv.config();

const connectionString = process.env.NEON_DATABASE_URL as string;
if (!connectionString) {
  throw new Error('Environment variable for database is not defined');
}

const pool = new Pool({ connectionString: connectionString });
export const neonDb = drizzle(pool, { schema, logger: true });