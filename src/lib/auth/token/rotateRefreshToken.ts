import { Request,Response } from "express";
import UserSession from "../../../database/schemas/UserSessions";
import { auth } from "..";
import { eq } from "drizzle-orm";
import { localDb } from "../../../database/localDb";
import { neonDb } from "../../../database/neonDb";
import dotenv from 'dotenv';
import { JWTPayload } from "jose";



// Load environment variables
dotenv.config();


// Explicit boolean conversion with fallback to false
const useNeon = process.env.USE_NEON === 'true' || false;

const db = useNeon ? neonDb : localDb;


// I want to return a boolean of false if the session does not exist
const rotateRefreshToken = async (req: Request, res: Response, decodedRefreshToken: JWTPayload): Promise<boolean>=> {

    console.log('decodedRefreshToken:', decodedRefreshToken)


    // Get oldSessionId from decodedRefreshToken
    const oldSessionId = String(decodedRefreshToken.sessionId)

    // Get UserSession with sessionId
    const sessionResponse = await db.select().from(UserSession).where(eq(UserSession.sessionId, oldSessionId))

    // Handle the case where the session does not exist
    if (!sessionResponse.length) {
        console.error("Session not found for sessionId:", oldSessionId);
        console.error("Query result:", sessionResponse);

        // Clear stale cookies
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");

        // Return false to indicate failure
        return false;
    }


    console.log("\nCurrent UserSession:",sessionResponse[0])
    // Extract old session userId and expirationTime
    const userId = sessionResponse[0].userId
    const newSessionExp = sessionResponse[0].expirationTime

    // Create newAuthenticatedUserSession object
    const newAuthenticatedUserSession = {
        userId: userId,
        startTime: new Date(),
        expirationTime: newSessionExp
    }


    // Delete old UserSession
    const deletionResult = await db.delete(UserSession).where(eq(UserSession.sessionId, oldSessionId))
    console.log('\ndeletionResult:', deletionResult)
    

    // Create an authenticated user session
    const [createdSession] = await db
    .insert(UserSession)
    .values(newAuthenticatedUserSession)
    .returning({
        sessionId: UserSession.sessionId,
        userId: UserSession.userId,
        expirationTime: UserSession.expirationTime,
    });


    // generate new refresh and access tokens
    const refreshToken = await auth.generateToken(createdSession, 'refresh')
    const accessToken = await auth.generateToken(createdSession, 'access')
    console.log("\nNew refreshToken:", refreshToken);
    console.log("\nNew accessToken:", accessToken);
    
    // Calculate maxAge for refreshToken
    const refreshTokenMaxAge = newAuthenticatedUserSession.expirationTime.getTime() - Date.now();

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

    // Add createdSession info to req.body.decoded
    req.body.decoded.sessionId = createdSession.sessionId;
    req.body.decoded.userId = createdSession.userId;        

    return true;
}


export default rotateRefreshToken;