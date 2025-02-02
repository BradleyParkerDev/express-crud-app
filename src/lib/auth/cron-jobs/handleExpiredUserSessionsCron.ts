import cron from 'node-cron';
import UserSession from '../../../database/schemas/UserSessions';
import SessionCronJobs from '../../../database/schemas/SessionCronJobs';
import { lt } from 'drizzle-orm';
import { localDb } from '../../../database/localDb';
import { neonDb } from '../../../database/neonDb';
import dotenv from 'dotenv';

dotenv.config();
const useNeon = process.env.USE_NEON === 'true' || false;
const db = useNeon ? neonDb : localDb;

const handleExpiredUserSessionsCron = () => {
    cron.schedule('*/10 * * * *', async () => { // Runs every 10 minutes
        const now = new Date();
        console.log("CRON: Checking for expired sessions at", now);

        try {
            // Fetch expired sessions
            const expiredSessions = await db
                .select()
                .from(UserSession)
                .where(lt(UserSession.expirationTime, now));

            const sessionsDeleted = expiredSessions.length;

            if (sessionsDeleted > 0) {
                console.log(`Found ${sessionsDeleted} expired sessions. Deleting...`);

                // Delete expired sessions
                await db.delete(UserSession).where(lt(UserSession.expirationTime, now));
                console.log("CRON: Expired sessions deleted successfully.");
            } else {
                console.log("CRON: No expired sessions found.");
            }

            // Insert a new entry into the cron_jobs table
            await db.insert(SessionCronJobs).values({
                lastChecked: now,
                sessionsDeleted,
            });

            console.log("CRON: handleExpiredUserSessions entry added to cron_jobs.");
        } catch (error) {
            console.error("CRON: Error while handling expired sessions:", error);
        }
    });
};

export default handleExpiredUserSessionsCron;
