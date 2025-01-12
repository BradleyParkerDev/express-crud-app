"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_core_1 = require("drizzle-orm/pg-core");
const CronJobs = (0, pg_core_1.pgTable)('cron_jobs', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(), // Unique identifier for each cron job entry
    jobName: (0, pg_core_1.varchar)('job_name', { length: 255 }).notNull(), // Name of the cron job
    lastChecked: (0, pg_core_1.timestamp)('last_checked').notNull(), // Time when the job was run
    sessionsDeleted: (0, pg_core_1.integer)('sessions_deleted').notNull(), // Number of sessions deleted
});
exports.default = CronJobs;
