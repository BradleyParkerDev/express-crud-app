import { Response } from "express";
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

console.log(useNeon);
const db = useNeon ? neonDb : localDb;



const rotateRefreshToken = async (res: Response, decodedRefreshToken: JWTPayload): Promise<void> => {

    console.log('decodedRefreshToken:', decodedRefreshToken)


    // Get oldSessionId from decodedRefreshToken
    const oldSessionId = String(decodedRefreshToken.sessionId)

    // Get UserSession with sessionId
    const sessionResponse = await db.select().from(UserSession).where(eq(UserSession.sessionId, oldSessionId))

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


}


export default rotateRefreshToken;