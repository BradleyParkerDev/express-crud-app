import { Response, Request, NextFunction, response } from "express";
import UserSession from "../../../database/schemas/UserSessions";
import createUserSession from "../session/createUserSession";

import verifyToken from "../token/verifyToken";
import rotateRefreshToken from "../token/rotateRefreshToken";
import { auth } from "..";

const handleSessionCookies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log("Authorization Middleware!!!");

    // Ensure `req.body.decoded` is initialized
    if (!req.body.decoded) {
        req.body.decoded = {};
    }

    let accessToken: string = req.cookies['accessToken'];
    let refreshToken: string = req.cookies['refreshToken'];
    let guestToken: string = req.cookies['guestToken'];

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

    if (!accessToken && refreshToken) {
        const decodedRefreshToken = await verifyToken(refreshToken);
        if (decodedRefreshToken) {
			req.body.decoded.sessionId = decodedRefreshToken.sessionId;

            // Rotate refresh token (placeholder logic)
            rotateRefreshToken(res, decodedRefreshToken )
            // res.cookie("refreshToken", newRefreshToken, {...options});
        } else {
            // Handle invalid refresh token
        }
    }

    // Skip guest token creation for all `/api/auth/*` routes
    if (!accessToken && !refreshToken && !req.path.startsWith("/api/auth")){
        if (guestToken) {
            const decodedGuestToken = await verifyToken(guestToken);
            if(decodedGuestToken){
                req.body.decoded.sessionId = decodedGuestToken?.sessionId;				
            }else{

            }

        } else {
            const guestUserSession = await auth.createUserSession();
            const guestToken = await auth.generateToken(guestUserSession, "guest");
			console.log(`guestToken: \n${guestToken}`);

            const guestTokenMaxAge = guestUserSession.expirationTime.getTime() - Date.now();

            res.cookie("guestToken", guestToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: guestTokenMaxAge,
            });
        }
    }

    next();
};

export default handleSessionCookies;