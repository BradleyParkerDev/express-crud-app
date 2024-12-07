import { Request, Response } from 'express';
import User from '../../database/schemas/Users';
import { eq } from 'drizzle-orm';
import { localDb } from "../../database/localDb";
import { neonDb } from "../../database/neonDb";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const deleteUser = async (req: Request, res: Response) => {
    // Explicit boolean conversion with fallback to false
    const useNeon = process.env.USE_NEON === 'true' || false;

    // Dynamically assign the database 
    const db = useNeon ? neonDb : localDb;

    try {

        
        // Ensure req.decoded is set by the authorizeUser middleware
        const id = req.decoded?.userData?.userId;

        if (!id) {
            return res.status(400).json({ message: "User ID is missing from request" });
        }

        // returns an array
        const response  = await db.delete(User).where(eq(User.userId, id)).returning();

        // if response is greater than 0 the user has been deleted
        if(response.length > 0){
            res.json({message:'User successfully deleted!', response: response[0]})        

        }else{
            res.json({message:'User not deleted!'})        

        }

    } catch (error) {
        res.json({message:'Error deleting user!', error: error})        

    }
}

export default deleteUser;