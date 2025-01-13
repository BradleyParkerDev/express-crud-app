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
const verifyToken_1 = __importDefault(require("../token/verifyToken"));
const rotateRefreshToken_1 = __importDefault(require("../token/rotateRefreshToken"));
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
const handleSessionCookies = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Authorization Middleware!!!");
    // Ensure `req.body.decoded` is initialized
    if (!req.body.decoded) {
        req.body.decoded = {};
    }
    let accessToken = req.cookies['accessToken'];
    let refreshToken = req.cookies['refreshToken'];
    let guestToken = req.cookies['guestToken'];
    // If access token present, add userId and sessionId to req.body.decoded
    if (accessToken) {
        const decodedAccessToken = yield (0, verifyToken_1.default)(accessToken);
        const decodedRefreshToken = yield (0, verifyToken_1.default)(refreshToken);
        if (decodedAccessToken && decodedRefreshToken) {
            req.body.decoded.userId = decodedAccessToken.userId;
            req.body.decoded.sessionId = decodedRefreshToken.sessionId;
        }
        else {
            // Handle invalid tokens
            req.body.decoded = null; // Optional: Clear decoded if invalid
        }
    }
    // No access token, rotate refresh token and get new access token
    if (!accessToken && refreshToken) {
        const decodedRefreshToken = yield (0, verifyToken_1.default)(refreshToken);
        if (decodedRefreshToken) {
            // Rotate refresh token 
            // if it is returned false I will call the createGuestSession function below
            const success = yield (0, rotateRefreshToken_1.default)(req, res, decodedRefreshToken);
            if (!success) {
                // Create a new guest session if rotation fails
                console.log("Creating guest session after failed token rotation");
                yield createNewGuestSession(res);
            }
        }
        else {
            // Handle invalid refresh token
            console.log("Invalid refresh token. Clearing cookies and creating guest session.");
            res.clearCookie("refreshToken");
            res.clearCookie("accessToken");
            yield createNewGuestSession(res);
        }
    }
    // Handle guest session, skip for all `/api/auth/*` routes
    if (!accessToken && !refreshToken && !req.path.startsWith("/api/auth")) {
        yield handleGuestSession(req, res, guestToken);
    }
    next();
});
exports.default = handleSessionCookies;
// Handles guest session
const handleGuestSession = (req, res, guestToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (guestToken) {
            const decodedGuestToken = yield (0, verifyToken_1.default)(guestToken);
            if (decodedGuestToken) {
                const guestSessionId = String(decodedGuestToken === null || decodedGuestToken === void 0 ? void 0 : decodedGuestToken.sessionId);
                console.log("\nguestSessionId: ", guestSessionId, "\n");
                // Check database for guest session
                const [foundGuestSession] = yield db.select().from(UserSessions_1.default).where((0, drizzle_orm_1.eq)(UserSessions_1.default.sessionId, guestSessionId));
                if (foundGuestSession) {
                    // Add sessionId to req.body.decoded if session found
                    console.log("\nfoundGuestSession: ", foundGuestSession, "\n");
                    req.body.decoded.sessionId = foundGuestSession.sessionId;
                }
                else {
                    // Delete cookie if the guest session does not exist in the database.
                    console.log("\nRemoving guestToken from cookies, no guest session Found!\n");
                    res.clearCookie("guestToken");
                    // Create a new guest session
                    yield createNewGuestSession(res);
                }
            }
            else {
                // If guest token invalid
                console.log("\nRemoving guestToken from cookies, token invalid!\n");
                res.clearCookie("guestToken");
                // Create a new guest session
                yield createNewGuestSession(res);
            }
        }
        else {
            // Create a new guest session
            yield createNewGuestSession(res);
        }
    }
    catch (error) {
        console.error("Error handling guest token:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Create new guest session, token, and cookie
const createNewGuestSession = (res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\nCreating new guest session, token, and cookie!\n");
    const guestUserSession = yield __1.auth.createUserSession();
    const guestToken = yield __1.auth.generateToken(guestUserSession, "guest");
    console.log(`guestToken: \n${guestToken}`);
    const guestTokenMaxAge = guestUserSession.expirationTime.getTime() - Date.now();
    res.cookie("guestToken", guestToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: guestTokenMaxAge,
    });
    return;
});
