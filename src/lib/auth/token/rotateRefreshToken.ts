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



// parameter sessionId
const rotateRefreshToken = async (res: Response, decodedRefreshToken: JWTPayload): Promise<void> => {
    let refreshToken:string = '';
    let accessToken:string = '';

    console.log('decodedRefreshToken:', decodedRefreshToken)

    const sessionResponse = await db.select().from(UserSession).where(eq(UserSession.sessionId, String(decodedRefreshToken.sessionId)))

    console.log(sessionResponse)
    // delete user session

    // create an authenticated user session with same expiration time


    // generate new refresh and access tokens

    // set refresh and access token in request cookies




}


export default rotateRefreshToken;