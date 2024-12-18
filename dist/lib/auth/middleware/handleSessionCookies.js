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
    // Ensure `req.body.decoded` is initialized
    if (!req.body.decoded) {
        req.body.decoded = {};
    }
    let accessToken = req.cookies['accessToken'];
    let refreshToken = req.cookies['refreshToken'];
    let guestToken = req.cookies['guestToken'];
    if (accessToken) {
        const decodedAccessToken = yield (0, verifyToken_1.default)(accessToken);
        const decodedRefreshToken = yield (0, verifyToken_1.default)(refreshToken);
        if (decodedAccessToken && decodedRefreshToken) {
            req.body.decoded.userId = decodedAccessToken.userId;
            req.body.decoded.sessionId = decodedRefreshToken.sessionId;
        }
        else {
            // Handle invalid tokens
            req.body.decoded = null; // Optional: Clear decoded if invalid
        }
    }
    if (!accessToken && refreshToken) {
        const decodedRefreshToken = yield (0, verifyToken_1.default)(refreshToken);
        if (decodedRefreshToken) {
            req.body.decoded.sessionId = decodedRefreshToken.sessionId;
            // Rotate refresh token (placeholder logic)
            // await rotateRefreshToken(res, decodedRefreshToken )
            // res.cookie("refreshToken", newRefreshToken, {...options});
        }
        else {
            // Handle invalid refresh token
        }
    }
    // Skip guest token creation for all `/api/auth/*` routes
    if (!accessToken && !refreshToken && !req.path.startsWith("/api/auth")) {
        if (guestToken) {
            const decodedGuestToken = yield (0, verifyToken_1.default)(guestToken);
            if (decodedGuestToken) {
                req.body.decoded.sessionId = decodedGuestToken === null || decodedGuestToken === void 0 ? void 0 : decodedGuestToken.sessionId;
            }
            else {
            }
        }
        else {
            const guestUserSession = yield __1.auth.createUserSession();
            const guestToken = yield __1.auth.generateToken(guestUserSession, "guest");
            console.log(`guestToken: \n${guestToken}`);
            const guestTokenMaxAge = guestUserSession.expirationTime.getTime() - Date.now();
            res.cookie("guestToken", guestToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: guestTokenMaxAge,
            });
        }
    }
    next();
});
exports.default = handleSessionCookies;
