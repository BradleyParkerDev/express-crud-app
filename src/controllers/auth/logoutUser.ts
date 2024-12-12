import { Request, Response } from "express";
import User from "../../database/schemas/Users";
import UserSession from "../../database/schemas/UserSessions";
import { eq } from "drizzle-orm";
import { auth } from "../../lib/auth"
import { localDb } from "../../database/localDb";
import { neonDb } from "../../database/neonDb";
import dotenv from 'dotenv';
import loginUser from "./loginUser";

// Load environment variables
dotenv.config();

const logoutUser = async (req: Request, res: Response) => {
    const useNeon = process.env.USE_NEON === "true" || false;
    const db = useNeon ? neonDb : localDb;

    try {
        const refreshToken = req.cookies["refreshToken"];
        if (!refreshToken) {
            return res.status(400).json({ success: false, message: "No refresh token provided." });
        }

        const decodedRefreshToken = await auth.verifyToken(refreshToken);
        if (!decodedRefreshToken?.sessionId) {
            return res.status(400).json({ success: false, message: "Invalid refresh token." });
        }

        const sessionId = String(decodedRefreshToken.sessionId);

        // Delete the session
        const deleteResult = await db.delete(UserSession).where(eq(UserSession.sessionId, sessionId));

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

        return res.status(200).json({ success: true, message: "User logged out successfully." });
    } catch (error) {
        console.error("Error during logout:", error);
        return res.status(500).json({ success: false, message: "Internal server error during logout." });
    }
};

export default logoutUser;