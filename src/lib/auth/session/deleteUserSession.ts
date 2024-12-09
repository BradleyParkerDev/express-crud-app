import UserSession from "../../../database/schemas/UserSessions";
import { eq } from 'drizzle-orm';

import { localDb } from "../../../database/localDb";
import { neonDb } from "../../../database/neonDb";
import { JWTPayload } from "jose";
// Assume environment variables are loaded in the main entry point

// Explicit boolean conversion
const useNeon = process.env.USE_NEON === 'true';

console.log('Using NeonDB:', useNeon);
const db = useNeon ? neonDb : localDb;

// Find a way to change parameter to type string, for object properties that are strings
const deleteUserSession = async (sessionId: string ): Promise<{ success: boolean; message: string }> => {
    try {
        const deletionResult = await db.delete(UserSession)
            .where(eq(UserSession.sessionId, sessionId))
            .returning();

        if (deletionResult.length > 0) {
            return { success: true, message: "User session successfully deleted!" };
        } else {
            return { success: false, message: "User session could not be found or was already deleted." };
        }
    } catch (error) {
        console.error('Error deleting user session:', error);
        return { success: false, message: "An error occurred while deleting the user session." };
    }
};

export default deleteUserSession;
