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
exports.generateToken = void 0;
const jose_1 = require("jose");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables
const generateToken = (userData, type) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (type === 'access') {
        // Calculate expiration time: 2 minutes in seconds
        const accessTokenExp = Math.floor(Date.now() / 1000) + 2 * 60; // 2 minutes
        // Secret key for signing the token
        const accessTokenSecretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
        // Prepare payload
        const accessTokenPayload = {
            userId: (_a = userData.userId) !== null && _a !== void 0 ? _a : undefined, // Ensure null becomes undefined if necessary
            type: 'access',
        };
        // Generate Access Token with 2 minutes expiration
        const accessToken = yield new jose_1.SignJWT(accessTokenPayload)
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
        const refreshTokenSecretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
        // Prepare payload
        const refreshTokenPayload = {
            sessionId: userData.sessionId,
            type: 'refresh',
        };
        // Generate Refresh Token
        const refreshToken = yield new jose_1.SignJWT(refreshTokenPayload)
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
        const guestTokenSecretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
        // Prepare payload
        const guestTokenPayload = {
            sessionId: userData.sessionId,
            type: 'guest',
        };
        // Generate Guest Token
        const guestToken = yield new jose_1.SignJWT(guestTokenPayload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime(guestTokenExp)
            .sign(guestTokenSecretKey);
        return guestToken; // Return the generated token
    }
    // Handle unsupported token types
    throw new Error(`Unsupported token type: ${type}`);
});
exports.generateToken = generateToken;
exports.default = exports.generateToken;
