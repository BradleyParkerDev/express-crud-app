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
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Explicit boolean conversion with fallback to false
const useNeon = process.env.USE_NEON === 'true' || false;
console.log(useNeon);
const db = useNeon ? neonDb_1.neonDb : localDb_1.localDb;
// parameter sessionId
const rotateRefreshToken = (res, decodedRefreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    let refreshToken = '';
    let accessToken = '';
    console.log('decodedRefreshToken:', decodedRefreshToken);
    const sessionResponse = yield db.select().from(UserSessions_1.default).where((0, drizzle_orm_1.eq)(UserSessions_1.default.sessionId, String(decodedRefreshToken.sessionId)));
    console.log(sessionResponse);
    // delete user session
    // create an authenticated user session with same expiration time
    // generate new refresh and access tokens
    // set refresh and access token in request cookies
});
exports.default = rotateRefreshToken;
