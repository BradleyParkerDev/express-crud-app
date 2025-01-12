import { pgTable, varchar, uuid, timestamp, integer } from 'drizzle-orm/pg-core';

const CronJobs = pgTable('cron_jobs', {
    id: uuid('id').primaryKey().defaultRandom(), // Unique identifier for each cron job entry
    jobName: varchar('job_name', { length: 255 }).notNull(), // Name of the cron job
    lastChecked: timestamp('last_checked').notNull(),        // Time when the job was run
    sessionsDeleted: integer('sessions_deleted').notNull(), // Number of sessions deleted
});

export default CronJobs;
