import { Request, Response } from 'express';
import User from '../../database/schemas/Users';
import UserSession from '../../database/schemas/UserSessions';
import { eq } from 'drizzle-orm';
import { auth } from '../../lib/auth';
import { localDb } from "../../database/localDb";
import { neonDb } from "../../database/neonDb";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const deleteUser = async (req: Request, res: Response): Promise<void>=> {
    const useNeon = process.env.USE_NEON === 'true';
    const db = useNeon ? neonDb : localDb;

    try {
        // Ensure req.body.decoded is set by middleware
        const userId = req.body.decoded?.userId;
        const sessionId = req.body.decoded?.sessionId;

        if (!userId) {
            res.status(400).json({ message: "User ID is missing from request!" });
        }

        if (!sessionId) {
            res.status(400).json({ message: "Session ID is missing from request!" });
        }

        // Delete session first
        const sessionResponse = await db.delete(UserSession).where(eq(UserSession.userId, userId)).returning();
        if (sessionResponse.length === 0) {
            res.status(400).json({ message: "Failed to delete session!" });
        }

        // Delete user
        const userResponse = await db.delete(User).where(eq(User.userId, userId)).returning();
        if (userResponse.length === 0) {
            res.status(404).json({ message: "User not found or already deleted!" });
        }


        // Clear cookies
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.status(200).json({
            message: "User and session successfully deleted!",
            user: userResponse[0],
        });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user!", error });
    }
};

export default deleteUser;
