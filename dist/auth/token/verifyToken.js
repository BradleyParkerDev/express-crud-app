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
const jose_1 = require("jose");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables
const verifyToken = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (!accessToken) {
        console.error('No token provided');
        return null;
    }
    try {
        const secretAccessKey = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET_KEY);
        const { payload } = yield (0, jose_1.jwtVerify)(accessToken, secretAccessKey, {
            algorithms: ['HS256']
        });
        // console.log('Token verified with ACCESS_TOKEN_SECRET_KEY:', payload);
        return payload;
    }
    catch (accessTokenError) {
        // console.error('Token verification failed with ACCESS_TOKEN_SECRET_KEY:', accessTokenError.message);
    }
    return null;
});
exports.default = verifyToken;
