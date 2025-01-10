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
const UserSessions_1 = __importDefault(require("../../../database/schemas/UserSessions"));
const __1 = require("..");
const drizzle_orm_1 = require("drizzle-orm");
const localDb_1 = require("../../../database/localDb");
const neonDb_1 = require("../../../database/neonDb");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Explicit boolean conversion with fallback to false
const useNeon = process.env.USE_NEON === 'true' || false;
const db = useNeon ? neonDb_1.neonDb : localDb_1.localDb;
// I want to return a boolean of false if the session does not exist
const rotateRefreshToken = (req, res, decodedRefreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('decodedRefreshToken:', decodedRefreshToken);
    // Get oldSessionId from decodedRefreshToken
    const oldSessionId = String(decodedRefreshToken.sessionId);
    // Get UserSession with sessionId
    const sessionResponse = yield db.select().from(UserSessions_1.default).where((0, drizzle_orm_1.eq)(UserSessions_1.default.sessionId, oldSessionId));
    // Handle the case where the session does not exist
    if (!sessionResponse.length) {
        console.error("Session not found for sessionId:", oldSessionId);
        console.error("Query result:", sessionResponse);
        // Clear stale cookies
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        // Return false to indicate failure
        return false;
    }
    console.log("\nCurrent UserSession:", sessionResponse[0]);
    // Extract old session userId and expirationTime
    const userId = sessionResponse[0].userId;
    const newSessionExp = sessionResponse[0].expirationTime;
    // Create newAuthenticatedUserSession object
    const newAuthenticatedUserSession = {
        userId: userId,
        startTime: new Date(),
        expirationTime: newSessionExp
    };
    // Delete old UserSession
    const deletionResult = yield db.delete(UserSessions_1.default).where((0, drizzle_orm_1.eq)(UserSessions_1.default.sessionId, oldSessionId));
    console.log('\ndeletionResult:', deletionResult);
    // Create an authenticated user session
    const [createdSession] = yield db
        .insert(UserSessions_1.default)
        .values(newAuthenticatedUserSession)
        .returning({
        sessionId: UserSessions_1.default.sessionId,
        userId: UserSessions_1.default.userId,
        expirationTime: UserSessions_1.default.expirationTime,
    });
    // generate new refresh and access tokens
    const refreshToken = yield __1.auth.generateToken(createdSession, 'refresh');
    const accessToken = yield __1.auth.generateToken(createdSession, 'access');
    console.log("\nNew refreshToken:", refreshToken);
    console.log("\nNew accessToken:", accessToken);
    // Calculate maxAge for refreshToken
    const refreshTokenMaxAge = newAuthenticatedUserSession.expirationTime.getTime() - Date.now();
    // Set tokens in cookies
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 2 * 60 * 1000, // 2 minutes
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: refreshTokenMaxAge, // Time remaining in milliseconds
    });
    // Add createdSession info to req.body.decoded
    req.body.decoded.sessionId = createdSession.sessionId;
    req.body.decoded.userId = createdSession.userId;
    return true;
});
exports.default = rotateRefreshToken;
