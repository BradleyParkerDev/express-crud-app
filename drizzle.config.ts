import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Determine database connection type
// Explicit boolean conversion with fallback to false
const useNeon = process.env.USE_NEON === 'true' || false;

// Select the appropriate connection string
const connectionString = useNeon ? process.env.NEON_DATABASE_URL as string : process.env.LOCAL_DATABASE_URL as string;

console.log(connectionString)
// Validate the connection string
if (!connectionString) {
  throw new Error(
    `Environment variable ${useNeon ? 'NEON_DATABASE_URL' : 'LOCAL_DATABASE_URL'} is not defined`
  );
}

// Export Drizzle configuration
export default defineConfig({
  schema: './src/database/schemas', // Path to your schema files
  out: './src/database/migrations', // Output folder for migrations
  dialect: 'postgresql', // Specify the database dialect
  dbCredentials: {
    url: connectionString, // Database connection string
  },
  verbose: true, // Enable detailed logs during migrations
  strict: true, // Enforce strict validation for migrations
});
