import { SignJWT } from 'jose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

interface UserData {
    sessionId: string;
    userId?: string | null;
    expirationTime: Date; // Expiration time as a Date object
}

export const generateToken = async (userData: UserData, type: string): Promise<string> => {
    if (type === 'access') {
        // Calculate expiration time: 2 minutes in seconds
        const accessTokenExp = Math.floor(Date.now() / 1000) + 2 * 60; // 2 minutes

        // Secret key for signing the token
        const accessTokenSecretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY!);

        // Prepare payload
        const accessTokenPayload = {
            userId: userData.userId ?? undefined, // Ensure null becomes undefined if necessary
            type: 'access',
        };

        // Generate Access Token with 2 minutes expiration
        const accessToken = await new SignJWT(accessTokenPayload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime(accessTokenExp)
            .sign(accessTokenSecretKey);

        return accessToken; // Return the generated token
    }

    if (type === 'refresh') {
        // Convert expirationTime to seconds since the Unix epoch
        const refreshTokenExp = Math.floor(userData.expirationTime.getTime() / 1000);

        // Secret key for signing the token
        const refreshTokenSecretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY!);

        // Prepare payload
        const refreshTokenPayload = {
            sessionId: userData.sessionId,
            type: 'refresh',
        };

        // Generate Refresh Token
        const refreshToken = await new SignJWT(refreshTokenPayload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime(refreshTokenExp)
            .sign(refreshTokenSecretKey);

        return refreshToken; // Return the generated token
    }

    if (type === 'guest') {
        // Convert expirationTime to seconds since the Unix epoch
        const guestTokenExp = Math.floor(userData.expirationTime.getTime() / 1000);

        // Secret key for signing the token
        const guestTokenSecretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY!);

        // Prepare payload
        const guestTokenPayload = {
            sessionId: userData.sessionId,
            type: 'guest',
        };

        // Generate Guest Token
        const guestToken = await new SignJWT(guestTokenPayload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime(guestTokenExp)
            .sign(guestTokenSecretKey);

        return guestToken; // Return the generated token
    }

    // Handle unsupported token types
    throw new Error(`Unsupported token type: ${type}`);
};

export default generateToken;
