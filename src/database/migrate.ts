//////////////////////////////////////////////////////////////////
// Neon and Local Migrations
//////////////////////////////////////////////////////////////////
import { migrate as neonMigrate } from 'drizzle-orm/neon-serverless/migrator'; 
import { migrate as localMigrate } from 'drizzle-orm/node-postgres/migrator';

import { localDb } from './localDb';
import { neonDb } from './neonDb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const main = async () => {
// Explicit boolean conversion with fallback to false
const useNeon = process.env.USE_NEON === 'true' || false;

 console.log(useNeon);
  // Dynamically assign the database and migrator
  const db = useNeon ? neonDb : localDb;
  const migrate = useNeon ? neonMigrate : localMigrate;

  try {
    // Run migrations
    await migrate(db, { migrationsFolder: './src/database/migrations' });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Error during migrations:', error);
    process.exit(1);
  }
};

main();
