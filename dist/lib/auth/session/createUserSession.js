"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserSessions_1 = __importDefault(require("../../../database/schemas/UserSessions"));
const localDb_1 = require("../../../database/localDb");
const neonDb_1 = require("../../../database/neonDb");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Explicit boolean conversion with fallback to false
const useNeon = process.env.USE_NEON === 'true' || false;
console.log(useNeon);
const db = useNeon ? neonDb_1.neonDb : localDb_1.localDb;
// Define a function to calculate an expiration time (7 days from now)
const getExpirationTime = () => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // Set expiration time to 7 days from now
    return expirationDate;
};
;
const createUserSession = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (userId) {
        // Create Authenticated User Session
        const authenticatedUserSession = {
            userId: userId,
            startTime: new Date(), // Start time set to current date and time
            expirationTime: getExpirationTime() // Calculate and set expiration time for 7 days from now
        };
        // Insert session and return the created session with sessionId
        // Drizzle returns an array, using array destructuring 
        const [createdSession] = yield db
            .insert(UserSessions_1.default)
            .values(authenticatedUserSession)
            .returning({ sessionId: UserSessions_1.default.sessionId, userId: UserSessions_1.default.userId, expirationTime: UserSessions_1.default.expirationTime });
        return createdSession; // Returns sessionId and expirationTime
    }
    else {
        // Create Authenticated User Session
        const guestUserSession = {
            startTime: new Date(), // Start time set to current date and time
            expirationTime: getExpirationTime() // Calculate and set expiration time for 7 days from now
        };
        // Insert session and return the created session with sessionId
        // Drizzle returns an array, using array destructuring 
        const [createdSession] = yield db
            .insert(UserSessions_1.default)
            .values(guestUserSession)
            .returning({ sessionId: UserSessions_1.default.sessionId, expirationTime: UserSessions_1.default.expirationTime });
        return createdSession; // Returns sessionId and expirationTime    
    }
});
exports.default = createUserSession;
