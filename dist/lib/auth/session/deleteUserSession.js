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
const drizzle_orm_1 = require("drizzle-orm");
const localDb_1 = require("../../../database/localDb");
const neonDb_1 = require("../../../database/neonDb");
// Assume environment variables are loaded in the main entry point
// Explicit boolean conversion
const useNeon = process.env.USE_NEON === 'true';
const db = useNeon ? neonDb_1.neonDb : localDb_1.localDb;
// Find a way to change parameter to type string, for object properties that are strings
const deleteUserSession = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletionResult = yield db.delete(UserSessions_1.default)
            .where((0, drizzle_orm_1.eq)(UserSessions_1.default.sessionId, sessionId))
            .returning();
        if (deletionResult.length > 0) {
            return { success: true, message: "User session successfully deleted!" };
        }
        else {
            return { success: false, message: "User session could not be found or was already deleted." };
        }
    }
    catch (error) {
        console.error('Error deleting user session:', error);
        return { success: false, message: "An error occurred while deleting the user session." };
    }
});
exports.default = deleteUserSession;
