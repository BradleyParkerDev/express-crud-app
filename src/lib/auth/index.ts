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

    // hashing
    generatePasswordHash,

    // middleware
    handleSessionCookies,

    // session
    createUserSession,
    deleteUserSession,

    // token
    generateToken,
    rotateRefreshToken,
    verifyToken,    

    // validation
    validatePassword

};
