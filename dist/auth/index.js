"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
// accessToken
const generateToken_1 = __importDefault(require("./token/generateToken"));
// hashing
const generatePasswordHash_1 = __importDefault(require("./hashing/generatePasswordHash"));
//  middleware
const authorizeUser_1 = __importDefault(require("./middleware/authorizeUser"));
// validation
const validatePassword_1 = __importDefault(require("./validation/validatePassword"));
exports.auth = {
    // accessToken
    generateToken: generateToken_1.default,
    // hashing
    generatePasswordHash: generatePasswordHash_1.default,
    // middleware
    authorizeUser: authorizeUser_1.default,
    // validation
    validatePassword: validatePassword_1.default
};
