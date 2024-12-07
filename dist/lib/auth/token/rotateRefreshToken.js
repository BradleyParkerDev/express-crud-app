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
const setAuthCookies_1 = __importDefault(require("../cookies/setAuthCookies"));
// parameter sessionId
const rotateRefreshToken = (res, sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    let refreshToken = '';
    let accessToken = '';
    // delete user session
    // create an authenticated user session with same expiration time
    // generate new refresh and access tokens
    // set refresh and access token in request cookies
    (0, setAuthCookies_1.default)(res, { accessToken, refreshToken });
    return refreshToken;
});
exports.default = rotateRefreshToken;
