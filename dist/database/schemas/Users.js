"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// database/schemas/users.js
const pg_core_1 = require("drizzle-orm/pg-core");
const User = (0, pg_core_1.pgTable)('users', {
    userId: (0, pg_core_1.uuid)('user_id').primaryKey().defaultRandom().unique(), // UUID v4 primary key
    userImage: (0, pg_core_1.text)('user_image'),
    firstName: (0, pg_core_1.text)('first_name').notNull(), // Not nullable text field
    lastName: (0, pg_core_1.text)('last_name').notNull(), // Not nullable text field
    emailAddress: (0, pg_core_1.text)('email_address').unique().notNull(), // Unique and not nullable
    userName: (0, pg_core_1.text)('user_name').unique().notNull(), // Unique and not nullable
    password: (0, pg_core_1.text)('password').notNull(), // Password field
    lastUpdated: (0, pg_core_1.timestamp)('last_updated').defaultNow().notNull(), // Update timestamp on modification
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull() // Only set on creation
});
exports.default = User;
