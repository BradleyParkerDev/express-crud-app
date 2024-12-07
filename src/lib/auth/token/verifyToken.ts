import { jwtVerify } from 'jose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const verifyToken = async (token:string) => {
    if (!token) {
        console.error('No token provided');
        return null;
    }
    try {
        const jwtSecretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
        const { payload } = await jwtVerify(token, jwtSecretKey, {
            algorithms: ['HS256']
        });
        return payload;
    } catch (error) {
        // console.error('Token verification failed with ACCESS_TOKEN_SECRET_KEY:', accessTokenError.message);
    }

    return null;

}

export default verifyToken


