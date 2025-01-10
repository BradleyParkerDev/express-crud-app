// import UserSession from "../../../database/schemas/UserSessions";
// import { eq ,lt} from 'drizzle-orm';
// import { localDb } from "../../../database/localDb";
// import { neonDb } from "../../../database/neonDb";
// import dotenv from 'dotenv';

// // Load environment variables
// dotenv.config();
// // Explicit boolean conversion with fallback to false
// const useNeon = process.env.USE_NEON === 'true' || false;

// console.log(useNeon);
// const db = useNeon ? neonDb : localDb;

// const handleExpiredUserSessions = async (userId:String) =>{

    

//     const now = new Date();

//     try {
//         // Select all expired sessions for the specified userId
//         const expiredSessions = await db
//             .select()
//             .from(UserSession)
//             .where(eq(UserSession.userId, userId))
//             .andWhere(lt(UserSession.expirationTime, now));

//         if (expiredSessions.length > 0) {
//             // Delete all expired sessions
//             await db
//                 .delete(UserSession)
//                 .where(eq(UserSession.userId, userId))
//                 .andWhere(lt(UserSession.expirationTime, now));

//             console.log(`${expiredSessions.length} expired sessions deleted for userId: ${userId}`);
//         } else {
//             console.log(`No expired sessions found for userId: ${userId}`);
//         }
//     } catch (error) {
//         console.error(`Error handling expired sessions for userId ${userId}:`, error);
//     }



// }

// export default handleExpiredUserSessions;
