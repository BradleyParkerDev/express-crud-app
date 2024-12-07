"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
// cookies
const setAuthCookies_1 = __importDefault(require("./cookies/setAuthCookies"));
const setGuestCookie_1 = __importDefault(require("./cookies/setGuestCookie"));
// hashing
const generatePasswordHash_1 = __importDefault(require("./hashing/generatePasswordHash"));
//  middleware
const handleSessionCookies_1 = __importDefault(require("./middleware/handleSessionCookies"));
// session
const createUserSession_1 = __importDefault(require("./session/createUserSession"));
const deleteUserSession_1 = __importDefault(require("./session/deleteUserSession"));
// token
const generateToken_1 = __importDefault(require("./token/generateToken"));
const rotateRefreshToken_1 = __importDefault(require("./token/rotateRefreshToken"));
const verifyToken_1 = __importDefault(require("./token/verifyToken"));
// validation
const validatePassword_1 = __importDefault(require("./validation/validatePassword"));
exports.auth = {
    // cookies
    setAuthCookies: setAuthCookies_1.default,
    setGuestCookie: setGuestCookie_1.default,
    // token
    generateToken: generateToken_1.default,
    rotateRefreshToken: rotateRefreshToken_1.default,
    verifyToken: verifyToken_1.default,
    // hashing
    generatePasswordHash: generatePasswordHash_1.default,
    // middleware
    handleSessionCookies: handleSessionCookies_1.default,
    // validation
    validatePassword: validatePassword_1.default,
    // session
    createUserSession: createUserSession_1.default,
    deleteUserSession: deleteUserSession_1.default
};
