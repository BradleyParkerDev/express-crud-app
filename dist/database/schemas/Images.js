"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// database/schemas/images.js
const pg_core_1 = require("drizzle-orm/pg-core");
const Users_1 = __importDefault(require("./Users"));
const Images = (0, pg_core_1.pgTable)('images', {
    imageId: (0, pg_core_1.uuid)('image_id').primaryKey().defaultRandom().unique(), // UUID v4 primary key
    userId: (0, pg_core_1.uuid)('user_id').notNull().references(() => Users_1.default.userId), // Foreign key referencing users.userId
    imageUrl: (0, pg_core_1.text)('image_url').notNull(), // S3 URL for the image
    name: (0, pg_core_1.text)('name'), // Optional user-assigned name for the image
    album: (0, pg_core_1.text)('album'), // Optional album/category
    lastUpdated: (0, pg_core_1.timestamp)('last_updated').defaultNow().notNull(), // Update timestamp on modification
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(), // Only set on creation
});
exports.default = Images;
