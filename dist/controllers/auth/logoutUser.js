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
const UserSessions_1 = __importDefault(require("../../database/schemas/UserSessions"));
const drizzle_orm_1 = require("drizzle-orm");
const auth_1 = require("../../lib/auth");
const localDb_1 = require("../../database/localDb");
const neonDb_1 = require("../../database/neonDb");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const useNeon = process.env.USE_NEON === "true" || false;
    const db = useNeon ? neonDb_1.neonDb : localDb_1.localDb;
    try {
        const refreshToken = req.cookies["refreshToken"];
        if (!refreshToken) {
            res.status(400).json({ success: false, message: "No refresh token provided." });
            return;
        }
        const decodedRefreshToken = yield auth_1.auth.verifyToken(refreshToken);
        if (!(decodedRefreshToken === null || decodedRefreshToken === void 0 ? void 0 : decodedRefreshToken.sessionId)) {
            res.status(400).json({ success: false, message: "Invalid refresh token." });
            return;
        }
        const sessionId = String(decodedRefreshToken.sessionId);
        // Delete the session
        const deleteResult = yield db.delete(UserSessions_1.default).where((0, drizzle_orm_1.eq)(UserSessions_1.default.sessionId, sessionId));
        // Clear cookies
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.clearCookie("guestToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).json({ success: true, message: "User logged out successfully." });
        return;
    }
    catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ success: false, message: "Internal server error during logout." });
        return;
    }
});
exports.default = logoutUser;
