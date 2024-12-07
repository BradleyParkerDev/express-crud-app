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
const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        console.error('No token provided');
        return null;
    }
    try {
        const jwtSecretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
        const { payload } = yield (0, jose_1.jwtVerify)(token, jwtSecretKey, {
            algorithms: ['HS256']
        });
        return payload;
    }
    catch (error) {
        // console.error('Token verification failed with ACCESS_TOKEN_SECRET_KEY:', accessTokenError.message);
    }
    return null;
});
exports.default = verifyToken;
