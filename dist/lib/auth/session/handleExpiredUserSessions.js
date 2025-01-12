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
const localDb_1 = require("../../../database/localDb");
const neonDb_1 = require("../../../database/neonDb");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const useNeon = process.env.USE_NEON === 'true' || false;
const db = useNeon ? neonDb_1.neonDb : localDb_1.localDb;
const handleExpiredUserSessions = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Checking database for expired user sessions!!!");
    // I will have a schema in drizzle to have the last check time, if it was more than an hour ago 
    // it will check again.
    return;
    // const now = new Date();
    // try {
    //     // Select all expired sessions for the specified userId
    //     const expiredSessions = await db
    //         .select()
    //         .from(UserSession)
    //         .where(and(eq(UserSession.userId, userId), lt(UserSession.expirationTime, now))); // Combine conditions with 'and'
    //     if (expiredSessions.length > 0) {
    //         // Delete all expired sessions
    //         await db
    //             .delete(UserSession)
    //             .where(and(eq(UserSession.userId, userId), lt(UserSession.expirationTime, now))); // Combine conditions with 'and'
    //         console.log(`${expiredSessions.length} expired sessions deleted for userId: ${userId}`);
    //     } else {
    //         console.log(`No expired sessions found for userId: ${userId}`);
    //     }
    // } catch (error) {
    //     console.error(`Error handling expired sessions for userId ${userId}:`, error);
    // }
});
exports.default = handleExpiredUserSessions;
