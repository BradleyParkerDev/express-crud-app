import { SignJWT } from 'jose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

interface UserData {
    sessionId: string;
    userId?: string | null;
    expirationTime: Date; // Expiration time as a Date object
}

export const generateToken = async (userData: UserData, type: 'access' | 'refresh' | 'guest'): Promise<string> => {
    // Secret key for signing the token
    const jwtSecretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY!);

    // Calculate expiration time: 2 minutes for access tokens
    const accessTokenExp = Math.floor(Date.now() / 1000) + 2 * 60; // 2 minutes
    const userSessionExp = Math.floor(userData.expirationTime.getTime() / 1000); // Session expiration in seconds

    if (type === 'access') {
        // Prepare payload for access token
        const accessTokenPayload = {
            userId: userData.userId ?? undefined, // Ensure null becomes undefined if necessary
            type: 'access',
        };

        // Generate Access Token
        return await new SignJWT(accessTokenPayload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime(accessTokenExp)
            .sign(jwtSecretKey);
    }

    // Prepare payload for refresh or guest tokens
    const tokenPayload = {
        sessionId: userData.sessionId,
        type: type, // 'refresh' or 'guest'
    };

    // Generate Refresh or Guest Token
    return await new SignJWT(tokenPayload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(userSessionExp)
        .sign(jwtSecretKey);
};

export default generateToken;
