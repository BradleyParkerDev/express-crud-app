import { pgTable, varchar, uuid, timestamp, integer } from 'drizzle-orm/pg-core';

const SessionCronJobs = pgTable('session_cron_jobs', {
    id: uuid('id').primaryKey().defaultRandom(), // Unique identifier for each cron job entry
    lastChecked: timestamp('last_checked').notNull(),        // Time when the job was run
    sessionsDeleted: integer('sessions_deleted').notNull(), // Number of sessions deleted
});

export default SessionCronJobs;
