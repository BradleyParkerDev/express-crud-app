import { Response, Request, NextFunction } from "express";
import UserSession from "../../../database/schemas/UserSessions";

import verifyToken from "../token/verifyToken";
import rotateRefreshToken from "../token/rotateRefreshToken";
import { auth } from "..";
import { eq } from "drizzle-orm";
import { localDb } from "../../../database/localDb";
import { neonDb } from "../../../database/neonDb";
import dotenv from 'dotenv';


// Load environment variables
dotenv.config();


// Explicit boolean conversion with fallback to false
const useNeon = process.env.USE_NEON === 'true' || false;

console.log(useNeon);
const db = useNeon ? neonDb : localDb;


const handleSessionCookies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log("Authorization Middleware!!!");

    // Ensure `req.body.decoded` is initialized
    if (!req.body.decoded) {
        req.body.decoded = {};
    }

    let accessToken: string = req.cookies['accessToken'];
    let refreshToken: string = req.cookies['refreshToken'];
    let guestToken: string = req.cookies['guestToken'];

    // If access token present, add userId and sessionId to req.body.decoded
    if (accessToken) {
        const decodedAccessToken = await verifyToken(accessToken);
        const decodedRefreshToken = await verifyToken(refreshToken);

        if (decodedAccessToken && decodedRefreshToken) {
            req.body.decoded.userId = decodedAccessToken.userId;
            req.body.decoded.sessionId = decodedRefreshToken.sessionId;
        } else {
            // Handle invalid tokens
            req.body.decoded = null; // Optional: Clear decoded if invalid
        }
    }

    // No access token, rotate refresh token and get new access token
    if (!accessToken && refreshToken) {
        const decodedRefreshToken = await verifyToken(refreshToken);
        if (decodedRefreshToken) {
            // Rotate refresh token 
            await rotateRefreshToken(req, res, decodedRefreshToken )
        } else {
            // Handle invalid refresh token
        }
    }

    // Handle guest session, skip for all `/api/auth/*` routes
    if (!accessToken && !refreshToken && !req.path.startsWith("/api/auth")){
        await handleGuestSession(req,res,guestToken)
    }
    next();
};


export default handleSessionCookies;



// Handles guest session
const handleGuestSession = async (req:Request,res:Response , guestToken:string):Promise<void> =>{

    try{
        if (guestToken) {
            const decodedGuestToken = await verifyToken(guestToken);
            if(decodedGuestToken){
                const guestSessionId = String(decodedGuestToken?.sessionId);	

                console.log("\nguestSessionId: ", guestSessionId, "\n")

                // Check database for guest session
                const [foundGuestSession] = await db.select().from(UserSession).where(eq(UserSession.sessionId, guestSessionId))
                
                if(foundGuestSession){
                    // Add sessionId to req.body.decoded if session found
                    console.log("\nfoundGuestSession: ", foundGuestSession, "\n")
                    req.body.decoded.sessionId = foundGuestSession.sessionId                     
                }else{
                    // Delete cookie if the guest session does not exist in the database.
                    console.log("\nRemoving guestToken from cookies, no guest session Found!\n")
                    res.clearCookie("guestToken");

                    // Create a new guest session
                    await createNewGuestSession(res);
                }

            }else{
                // If guest token invalid
                console.log("\nRemoving guestToken from cookies, token invalid!\n")
                res.clearCookie("guestToken");

                // Create a new guest session
                await createNewGuestSession(res);
            }

        } else {

            // Create a new guest session
            await createNewGuestSession(res);
        }
        
    } catch (error) {
        console.error("Error handling guest token:", error);
        res.status(500).json({ error: "Internal server error" });
    }


}


// Create new guest session, token, and cookie
const createNewGuestSession = async (res:Response): Promise<void> =>{
    console.log("\nCreating new guest session, token, and cookie!\n")
    const guestUserSession = await auth.createUserSession();
    const guestToken = await auth.generateToken(guestUserSession, "guest");
    console.log(`guestToken: \n${guestToken}`);

    const guestTokenMaxAge = guestUserSession.expirationTime.getTime() - Date.now();

    res.cookie("guestToken", guestToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: guestTokenMaxAge,
    });
}
