import { Request, Response } from "express";
import User from "../../database/schemas/Users";
import { eq } from "drizzle-orm";
import { auth } from "../../lib/auth"
import { localDb } from "../../database/localDb";
import { neonDb } from "../../database/neonDb";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const logoutUser = (req: Request, res: Response) => {

    // Explicit boolean conversion with fallback to false
    const useNeon = process.env.USE_NEON === 'true' || false;

    // Dynamically assign the database 
    const db = useNeon ? neonDb : localDb;

}


export default logoutUser;