import { Request, Response } from "express";
import UserSession from "../../database/schemas/UserSessions";
import { eq } from "drizzle-orm";
import { auth } from "../../lib/auth"
import { localDb } from "../../database/localDb";
import { neonDb } from "../../database/neonDb";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const logoutUser = async (req: Request, res: Response): Promise<void> => {
    const useNeon = process.env.USE_NEON === "true" || false;
    const db = useNeon ? neonDb : localDb;

    try {
        const refreshToken = req.cookies["refreshToken"];
        if (!refreshToken) {
            res.status(400).json({ success: false, message: "No refresh token provided." });
            return;
        }

        const decodedRefreshToken = await auth.verifyToken(refreshToken);
        if (!decodedRefreshToken?.sessionId) {
            res.status(400).json({ success: false, message: "Invalid refresh token." });
            return;
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

        res.status(200).json({ success: true, message: "User logged out successfully." });
        return;
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ success: false, message: "Internal server error during logout." });
        return;

    }
};

export default logoutUser;