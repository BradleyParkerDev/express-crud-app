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
    // Secret key for signing the token
    const jwtSecretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    // Calculate expiration time: 2 minutes for access tokens
    const accessTokenExp = Math.floor(Date.now() / 1000) + 2 * 60; // 2 minutes
    const userSessionExp = Math.floor(userData.expirationTime.getTime() / 1000); // Session expiration in seconds
    if (type === 'access') {
        // Prepare payload for access token
        const accessTokenPayload = {
            userId: (_a = userData.userId) !== null && _a !== void 0 ? _a : undefined, // Ensure null becomes undefined if necessary
            type: 'access',
        };
        // Generate Access Token
        return yield new jose_1.SignJWT(accessTokenPayload)
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
    return yield new jose_1.SignJWT(tokenPayload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(userSessionExp)
        .sign(jwtSecretKey);
});
exports.generateToken = generateToken;
exports.default = exports.generateToken;
