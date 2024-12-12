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
const UserSessions_1 = __importDefault(require("../../database/schemas/UserSessions"));
const drizzle_orm_1 = require("drizzle-orm");
const localDb_1 = require("../../database/localDb");
const neonDb_1 = require("../../database/neonDb");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const useNeon = process.env.USE_NEON === 'true';
    const db = useNeon ? neonDb_1.neonDb : localDb_1.localDb;
    try {
        // Ensure req.body.decoded is set by middleware
        const userId = (_a = req.body.decoded) === null || _a === void 0 ? void 0 : _a.userId;
        const sessionId = (_b = req.body.decoded) === null || _b === void 0 ? void 0 : _b.sessionId;
        if (!userId) {
            return res.status(400).json({ message: "User ID is missing from request!" });
        }
        if (!sessionId) {
            return res.status(400).json({ message: "Session ID is missing from request!" });
        }
        // Delete session first
        const sessionResponse = yield db.delete(UserSessions_1.default).where((0, drizzle_orm_1.eq)(UserSessions_1.default.userId, userId)).returning();
        if (sessionResponse.length === 0) {
            return res.status(400).json({ message: "Failed to delete session!" });
        }
        // Delete user
        const userResponse = yield db.delete(Users_1.default).where((0, drizzle_orm_1.eq)(Users_1.default.userId, userId)).returning();
        if (userResponse.length === 0) {
            return res.status(404).json({ message: "User not found or already deleted!" });
        }
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
        return res.status(200).json({
            message: "User and session successfully deleted!",
            user: userResponse[0],
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Error deleting user!", error });
    }
});
exports.default = deleteUser;
