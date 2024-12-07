
import { Response, Request, NextFunction } from "express";
import UserSession from "../../../database/schemas/UserSessions";
import createUserSession from "../session/createUserSession";

import verifyToken from "../token/verifyToken";
import rotateRefreshToken from "../token/rotateRefreshToken";
import setAuthCookies from "../cookies/setAuthCookies";
import setGuestCookie from "../cookies/setGuestCookie";
import { auth } from "..";

const handleSessionCookies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {


	console.log("Authorization Middleware!!!")

	// Get the tokens from the cookies
	let accessToken: string = req.cookies['accessToken'];
	let refreshToken: string = req.cookies['refreshToken'];
	let guestToken: string = req.cookies['guestToken'];



	if(accessToken){
		// verifyToken
		const decoded = verifyToken(accessToken)
		// if decoded token valid
			// add decoded token to req body
		// else
			// set access token to null, remove decoded from request body
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
				const decoded = verifyToken(guestToken)
				
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

	next()

};

export default handleSessionCookies;



	//   console.log(`accessToken before setting: ${accessToken}`);
	//   // If token is undefined, set a new cookie
	//   if (!accessToken) {
	//     res.cookie("accessToken", "bye", {
	//       httpOnly: true,  // Secure, inaccessible to client-side scripts
	//       secure: process.env.NODE_ENV === "production", // Use HTTPS in production
	//       maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
	//       sameSite: "strict", // Helps prevent CSRF
	//     });
	//     console.log(`New cookie set: bye`);
	//   } else {
	//     console.log(`accessToken already exists: ${accessToken}`);
	//   }

	// //   Send a response back to the client
	//   res.status(200).send("Cookie checked/set!");