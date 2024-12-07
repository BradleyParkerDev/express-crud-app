"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// database/schemas/sessions.js
const pg_core_1 = require("drizzle-orm/pg-core");
const Users_1 = __importDefault(require("./Users"));
// Define UserSession table
const UserSession = (0, pg_core_1.pgTable)('user_sessions', {
    sessionId: (0, pg_core_1.uuid)('session_id').primaryKey().defaultRandom().unique(), // UUID v4 primary key for the session
    userId: (0, pg_core_1.uuid)('user_id').references(() => Users_1.default.userId), // Foreign key that references userId in the Users table
    startTime: (0, pg_core_1.timestamp)('start_time').defaultNow().notNull(), // Automatically sets current timestamp on creation
    expirationTime: (0, pg_core_1.timestamp)('expiration_time').notNull() // Expiration timestamp for session
});
exports.default = UserSession;
