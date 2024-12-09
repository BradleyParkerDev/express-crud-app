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
const verifyToken_1 = __importDefault(require("../token/verifyToken"));
const __1 = require("..");
const handleSessionCookies = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Authorization Middleware!!!");
    // Get the tokens from the cookies
    let accessToken = req.cookies['accessToken'];
    let refreshToken = req.cookies['refreshToken'];
    let guestToken = req.cookies['guestToken'];
    if (accessToken) {
        // verifyToken
        const decoded = yield (0, verifyToken_1.default)(accessToken);
        // if decoded token valid
        if (decoded) {
            req.body.decoded = decoded;
        }
        else {
            // set access token to null, remove decoded from request body
        }
    }
    if (!accessToken) {
        // try refreshing access token
        if (refreshToken) {
            // verifyToken
            // if token valid 
            // rotate refresh token
            // return
            // else 
            // logoutUser
        }
        // if no refreshToken 
        if (!refreshToken) {
            if (guestToken) {
                // verify guestToken
                const decoded = yield (0, verifyToken_1.default)(guestToken);
                req.body.decoded = decoded;
            }
            else {
                // create guest session
                const guestUserSession = yield __1.auth.createUserSession();
                // create guest token
                const guestToken = yield __1.auth.generateToken(guestUserSession, "guest");
                console.log(`guestToken: \n${guestToken}`);
                // Calculate maxAge for guestToken
                const guestTokenMaxAge = guestUserSession.expirationTime.getTime() - Date.now();
                // set cookies
                res.cookie("guestToken", guestToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: guestTokenMaxAge, // Time remaining in milliseconds
                });
            }
        }
    }
    // console.log(req.body)
    next();
});
exports.default = handleSessionCookies;
