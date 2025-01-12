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
const node_cron_1 = __importDefault(require("node-cron"));
const UserSessions_1 = __importDefault(require("../../../database/schemas/UserSessions"));
const CronJobs_1 = __importDefault(require("../../../database/schemas/CronJobs"));
const drizzle_orm_1 = require("drizzle-orm");
const localDb_1 = require("../../../database/localDb");
const neonDb_1 = require("../../../database/neonDb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const useNeon = process.env.USE_NEON === 'true' || false;
const db = useNeon ? neonDb_1.neonDb : localDb_1.localDb;
const handleExpiredUserSessionsCron = () => {
    node_cron_1.default.schedule('*/10 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        const now = new Date();
        console.log("CRON: Checking for expired sessions at", now);
        try {
            // Fetch expired sessions
            const expiredSessions = yield db
                .select()
                .from(UserSessions_1.default)
                .where((0, drizzle_orm_1.lt)(UserSessions_1.default.expirationTime, now));
            const sessionsDeleted = expiredSessions.length;
            if (sessionsDeleted > 0) {
                console.log(`Found ${sessionsDeleted} expired sessions. Deleting...`);
                // Delete expired sessions
                yield db.delete(UserSessions_1.default).where((0, drizzle_orm_1.lt)(UserSessions_1.default.expirationTime, now));
                console.log("CRON: Expired sessions deleted successfully.");
            }
            else {
                console.log("CRON: No expired sessions found.");
            }
            // Insert a new entry into the cron_jobs table
            yield db.insert(CronJobs_1.default).values({
                jobName: 'handleExpiredUserSessions',
                lastChecked: now,
                sessionsDeleted,
            });
            console.log("CRON: handleExpiredUserSessions entry added to cron_jobs.");
        }
        catch (error) {
            console.error("CRON: Error while handling expired sessions:", error);
        }
    }));
};
exports.default = handleExpiredUserSessionsCron;
