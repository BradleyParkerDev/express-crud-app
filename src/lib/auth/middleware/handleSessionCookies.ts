
import { Response, Request, NextFunction } from "express";
import UserSession from "../../../database/schemas/UserSessions";
import createUserSession from "../session/createUserSession";

import verifyToken from "../token/verifyToken";
import rotateRefreshToken from "../token/rotateRefreshToken";
import { auth } from "..";

const handleSessionCookies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {


	console.log("Authorization Middleware!!!")

	// Get the tokens from the cookies
	let accessToken: string = req.cookies['accessToken'];
	let refreshToken: string = req.cookies['refreshToken'];
	let guestToken: string = req.cookies['guestToken'];



	if(accessToken){
		// verifyToken
		const decoded = await verifyToken(accessToken)
		// if decoded token valid
		if(decoded){
			req.body.decoded = decoded;
		}else{
			// set access token to null, remove decoded from request body

		}
	
	}

	if(!accessToken){
		// try refreshing access token
		if(refreshToken){
		// verifyToken
		// if token valid 
			// rotate refresh token
			// return
		// else 
			// logoutUser
		}

		// if no refreshToken 
		if(!refreshToken){
			if(guestToken){
				// verify guestToken
				const decoded = await verifyToken(guestToken)
				req.body.decoded = decoded;
				
			}else{
				// create guest session
				const guestUserSession = await auth.createUserSession()

				// create guest token

				const guestToken = await auth.generateToken(guestUserSession, "guest")
				console.log(`guestToken: \n${guestToken}`);
				// set cookies
				// Calculate maxAge for guestToken
				const guestTokenMaxAge = guestUserSession.expirationTime.getTime() - Date.now();
				res.cookie("guestToken", guestToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "strict",
					maxAge: guestTokenMaxAge, // Time remaining in milliseconds
				});
			}
		}

	}
	// console.log(req.body)

	next()

};

export default handleSessionCookies;

