import { Request, Response } from 'express';
import User from '../../database/schemas/Users';
import { eq } from 'drizzle-orm';
import { localDb } from "../../database/localDb";
import { neonDb } from "../../database/neonDb";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();


const getUser = async (req: Request, res: Response): Promise<void> => {

    // Explicit boolean conversion with fallback to false
    const useNeon = process.env.USE_NEON === 'true' || false;

    // Dynamically assign the database 
    const db = useNeon ? neonDb : localDb;
    try {

        // Ensure req.decoded is set by the authorizeUser middleware
        const userId = req.body.decoded?.userId;
        console.log(`get-user userId: ${userId}`)
        if (!userId) {
            res.status(400).json({ message: "User ID is missing from request!" });
            return
        }

        const foundUserArr = await db.select().from(User).where(eq(User.userId, userId));

        if (foundUserArr.length === 0) {
            res.status(404).json({ success: false, message: "User not found" });
        }

        // 
        const foundUser = {
            userImage: foundUserArr[0].userImage ,
            firstName: foundUserArr[0].firstName ,
            lastName: foundUserArr[0].lastName ,
            emailAddress: foundUserArr[0].emailAddress ,
            userName: foundUserArr[0].userName,
            lastUpdated: foundUserArr[0].lastUpdated            
        }

        res.status(200).json({ success: true, user: foundUser });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ success: false, message: "Error fetching user", error });
    }
}

export default getUser;
