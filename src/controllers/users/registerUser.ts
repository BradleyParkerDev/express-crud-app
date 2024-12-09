import { Request, Response } from 'express';
import User from '../../database/schemas/Users';
import { auth } from '../../lib/auth';
import { localDb } from "../../database/localDb";
import { neonDb } from "../../database/neonDb";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();


const registerUser = async (req: Request, res: Response) => {
    const saltRounds = 5;
    const passwordHash = await auth.generatePasswordHash(req.body.password, saltRounds)

    // Explicit boolean conversion with fallback to false
    const useNeon = process.env.USE_NEON === 'true' || false;

    // Dynamically assign the database 
    const db = useNeon ? neonDb : localDb;
    try {

        
        // Creating new user data
        const newUserData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            emailAddress: req.body.emailAddress,
            password: passwordHash
        }; 

        await db.insert(User).values(newUserData);
        res.status(200).json({ success: true, message: "User successfully registered!" });
    
    } catch (error) {
        console.error("Error registering new user:", error);
        res.status(500).send({ message: "Error registering new user.", error });
    }
}

export default registerUser;
