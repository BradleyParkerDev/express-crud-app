"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//////////////////////////////////////////////////////////////////
// Neon and Local Migrations
//////////////////////////////////////////////////////////////////
const migrator_1 = require("drizzle-orm/neon-serverless/migrator");
const migrator_2 = require("drizzle-orm/node-postgres/migrator");
const localDb_1 = require("./localDb");
const neonDb_1 = require("./neonDb");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    // Explicit boolean conversion with fallback to false
    const useNeon = process.env.USE_NEON === 'true' || false;
    console.log(useNeon);
    // Dynamically assign the database and migrator
    const db = useNeon ? neonDb_1.neonDb : localDb_1.localDb;
    const migrate = useNeon ? migrator_1.migrate : migrator_2.migrate;
    try {
        // Run migrations
        yield migrate(db, { migrationsFolder: './src/database/migrations' });
        console.log('Migrations completed successfully');
    }
    catch (error) {
        console.error('Error during migrations:', error);
        process.exit(1);
    }
});
main();
