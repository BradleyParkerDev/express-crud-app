import UserSession from "../../../database/schemas/UserSessions";
import { localDb } from "../../../database/localDb";
import { neonDb } from "../../../database/neonDb";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();


// Explicit boolean conversion with fallback to false
const useNeon = process.env.USE_NEON === 'true' || false;

const db = useNeon ? neonDb : localDb;



// Define a function to calculate an expiration time (7 days from now)
const getExpirationTime = () => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // Set expiration time to 7 days from now
    return expirationDate;
}
interface UserSessionResponse  {
    sessionId: string;
    userId?: string | null;
    expirationTime: Date;
};

const createUserSession = async (userId?: string): Promise<UserSessionResponse> => {
    if (userId) {
        // Create Authenticated User Session
        const authenticatedUserSession = {
            userId: userId,
            startTime: new Date(),                // Start time set to current date and time
            expirationTime: getExpirationTime()    // Calculate and set expiration time for 7 days from now
        };

        // Insert session and return the created session with sessionId
        // Drizzle returns an array, using array destructuring 
        const [createdSession] = await db
            .insert(UserSession)
            .values(authenticatedUserSession)
            .returning({ sessionId: UserSession.sessionId, userId: UserSession.userId,expirationTime: UserSession.expirationTime });

        return createdSession; // Returns sessionId and expirationTime
    } else {
        // Create Authenticated User Session
        const guestUserSession = {
            startTime: new Date(),                // Start time set to current date and time
            expirationTime: getExpirationTime()    // Calculate and set expiration time for 7 days from now
        };

        // Insert session and return the created session with sessionId
        // Drizzle returns an array, using array destructuring 
        const [createdSession] = await db
            .insert(UserSession)
            .values(guestUserSession)
            .returning({ sessionId: UserSession.sessionId, expirationTime: UserSession.expirationTime });

        return createdSession; // Returns sessionId and expirationTime    
   }
};


export default createUserSession;
