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
const generateToken = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    // Calculate expiration time: 7 days in seconds
    const accessTokenExp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
    // Calculate expiration time: 2 minutes in seconds
    // const accessTokenExp = Math.floor(Date.now() / 1000) + 2 * 60;
    // Prepare keys
    const accessTokenSecretKey = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET_KEY);
    // Prepare payloads and set headers
    const accessTokenPayload = {
        userData,
        type: 'access'
    };
    // Generate Access Token with 7 days expiration
    const accessToken = yield new jose_1.SignJWT(accessTokenPayload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(accessTokenExp)
        .sign(accessTokenSecretKey);
    return accessToken; // Return the token directly
});
exports.generateToken = generateToken;
exports.default = exports.generateToken;
