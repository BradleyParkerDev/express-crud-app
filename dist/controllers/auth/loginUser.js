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
const Users_1 = __importDefault(require("../../database/schemas/Users"));
const drizzle_orm_1 = require("drizzle-orm");
const auth_1 = require("../../lib/auth");
const localDb_1 = require("../../database/localDb");
const neonDb_1 = require("../../database/neonDb");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Explicit boolean conversion with fallback to false
    const useNeon = process.env.USE_NEON === 'true' || false;
    // Dynamically assign the database 
    const db = useNeon ? neonDb_1.neonDb : localDb_1.localDb;
    const userLoginData = {
        emailAddress: req.body.emailAddress,
        password: req.body.password
    };
    // Finding user in database
    const foundUserArr = yield db.select().from(Users_1.default).where((0, drizzle_orm_1.eq)(Users_1.default.emailAddress, userLoginData.emailAddress));
    console.log(foundUserArr);
    // If user not found
    if (foundUserArr.length === 0) {
        return res.status(404).json({ success: false, message: 'Could not find user.' });
    }
    const foundUser = foundUserArr[0];
    // Validate password
    const passwordValid = yield auth_1.auth.validatePassword(userLoginData.password, foundUser.password);
    // If password not valid
    if (!passwordValid) {
        return res.status(401).json({ success: false, message: 'Password was incorrect.' });
    }
    // Create session tokens and cookies
    if (passwordValid) {
        // Handle guest session cleanup
        if (req.cookies['guestToken']) {
            const guestToken = req.cookies['guestToken'];
            try {
                const decodedGuestToken = yield auth_1.auth.verifyToken(guestToken);
                if (decodedGuestToken === null || decodedGuestToken === void 0 ? void 0 : decodedGuestToken.sessionId) {
                    res.clearCookie("guestToken");
                    const deleteSessionMessage = yield auth_1.auth.deleteUserSession(decodedGuestToken.sessionId);
                    console.log('Guest session deletion:', deleteSessionMessage.message);
                }
                else {
                    console.error("Invalid or null decoded guest token.");
                }
            }
            catch (error) {
                console.error('Error deleting guest session:', error);
            }
        }
        // Create authenticated user session
        const authenticatedUserSession = yield auth_1.auth.createUserSession(foundUser.userId);
        // Create access and refresh tokens
        const accessToken = yield auth_1.auth.generateToken(authenticatedUserSession, "access");
        const refreshToken = yield auth_1.auth.generateToken(authenticatedUserSession, "refresh");
        console.log(`accessToken: \n${accessToken}`);
        console.log(`refreshToken: \n ${refreshToken}`);
        // Calculate maxAge for refreshToken
        const refreshTokenMaxAge = authenticatedUserSession.expirationTime.getTime() - Date.now();
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
        return res.status(200).json({ success: true, message: "User has successfully logged in!" });
    }
});
exports.default = loginUser;
