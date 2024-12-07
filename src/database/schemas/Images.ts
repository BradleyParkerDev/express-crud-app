// database/schemas/images.js
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import User from './Users';

const Images = pgTable('images', {
  imageId: uuid('image_id').primaryKey().defaultRandom().unique(), // UUID v4 primary key
  userId: uuid('user_id').notNull().references(() => User.userId), // Foreign key referencing users.userId
  imageUrl: text('image_url').notNull(), // S3 URL for the image
  name: text('name'), // Optional user-assigned name for the image
  album: text('album'), // Optional album/category
  lastUpdated: timestamp('last_updated').defaultNow().notNull(), // Update timestamp on modification
  createdAt: timestamp('created_at').defaultNow().notNull(), // Only set on creation
});

export default Images;
