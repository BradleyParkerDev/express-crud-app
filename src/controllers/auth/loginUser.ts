import { Request, Response } from "express";
import User from "../../database/schemas/Users";
import { eq } from "drizzle-orm";
import { auth } from "../../lib/auth"
import { localDb } from "../../database/localDb";
import { neonDb } from "../../database/neonDb";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const loginUser = async (req: Request, res: Response) => {

    // Explicit boolean conversion with fallback to false
    const useNeon = process.env.USE_NEON === 'true' || false;

    // Dynamically assign the database 
    const db = useNeon ? neonDb : localDb;


    const userLoginData = {
        emailAddress: req.body.emailAddress,
        password: req.body.password
    };

    // Finding user in database
    const foundUserArr = await db.select().from(User).where(eq(User.emailAddress, userLoginData.emailAddress));
    console.log(foundUserArr);

    // If user not found
    if (foundUserArr.length === 0) {
        return res.status(404).json({ success: false, message: 'Could not find user.' });
    }

    const foundUser = foundUserArr[0];

    // Validate password
    const passwordValid = await auth.validatePassword(userLoginData.password, foundUser.password);

    // If password not valid
    if (!passwordValid) {
        return res.status(401).json({ success: false, message: 'Password was incorrect.' });
    }

    // Create session tokens and cookies
    if(passwordValid){
        
        // Handle guest session cleanup
        if (req.cookies['guestToken']) {
            const guestToken = req.cookies['guestToken'];
            try {
                const decodedGuestToken = await auth.verifyToken(guestToken);

                if (decodedGuestToken?.sessionId) {
                    res.clearCookie("guestToken");
                    const sessionId = String(decodedGuestToken?.sessionId);
                    const deleteSessionMessage = await auth.deleteUserSession(sessionId);
                    console.log('Guest session deletion:', deleteSessionMessage.message);
                } else {
                    console.error("Invalid or null decoded guest token.");
                }
            } catch (error) {
                console.error('Error deleting guest session:', error);
            }
        }

        // Create authenticated user session
        const authenticatedUserSession = await auth.createUserSession(foundUser.userId);


        // Create access and refresh tokens
        const accessToken = await auth.generateToken(authenticatedUserSession, "access")
        const refreshToken = await auth.generateToken(authenticatedUserSession, "refresh")
 
        console.log(`accessToken: \n${accessToken}`)
        console.log(`refreshToken: \n ${refreshToken}`)

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
        
        return res.status(200).json({success: true, message: "User has successfully logged in!"});
    }

};

export default loginUser;
