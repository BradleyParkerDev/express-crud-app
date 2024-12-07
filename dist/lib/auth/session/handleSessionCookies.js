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
Object.defineProperty(exports, "__esModule", { value: true });
const handleSessionCookies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the token from cookies
    let accessToken = req.cookies['accessToken'];
    let refreshToken = req.cookies['refreshToken'];
    let guestToken = req.cookies['guestToken'];
    if (accessToken) {
    }
    console.log(`accessToken before setting: ${accessToken}`);
    // If token is undefined, set a new cookie
    if (!accessToken) {
        res.cookie("accessToken", "bye", {
            httpOnly: true, // Secure, inaccessible to client-side scripts
            secure: process.env.NODE_ENV === "production", // Use HTTPS in production
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
            sameSite: "strict", // Helps prevent CSRF
        });
        console.log(`New cookie set: bye`);
    }
    else {
        console.log(`accessToken already exists: ${accessToken}`);
    }
    //   Send a response back to the client
    res.status(200).send("Cookie checked/set!");
});
exports.default = handleSessionCookies;
