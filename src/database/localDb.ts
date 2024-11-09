///////////////////////////////////////////////////////////////////////
// Local Connection
///////////////////////////////////////////////////////////////////////
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from 'pg';
import * as schema from './schemas'
import dotenv from 'dotenv';


// Load environment variables from .env file
dotenv.config();


const connectionString = process.env.LOCAL_DATABASE_URL as string;
if (!connectionString) {
  throw new Error('Environment variable for database is not defined');
}

const pool = new Pool({ connectionString: connectionString });
export const localDb = drizzle(pool, { schema, logger: true });
