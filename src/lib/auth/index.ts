// cookies
import setAuthCookies from "./cookies/setAuthCookies";
import setGuestCookie from "./cookies/setGuestCookie";

// hashing
import generatePasswordHash from "./hashing/generatePasswordHash";

//  middleware
import handleSessionCookies from "./middleware/handleSessionCookies";

// session
import createUserSession from "./session/createUserSession";
import deleteUserSession from "./session/deleteUserSession";

// token
import generateToken from "./token/generateToken";
import rotateRefreshToken from "./token/rotateRefreshToken";
import verifyToken from "./token/verifyToken";

// validation
import validatePassword from "./validation/validatePassword";



export const auth = {
    // cookies
    setAuthCookies,
    setGuestCookie,

    // token
    generateToken,
    rotateRefreshToken,
    verifyToken,

    // hashing
    generatePasswordHash,

    // middleware
    handleSessionCookies,

    // validation
    validatePassword,

    // session
    createUserSession,
    deleteUserSession
};
