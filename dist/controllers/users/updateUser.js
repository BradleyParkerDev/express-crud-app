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
const Users_1 = __importDefault(require("../../database/schemas/Users"));
const drizzle_orm_1 = require("drizzle-orm");
const auth_1 = require("../../lib/auth");
const localDb_1 = require("../../database/localDb");
const neonDb_1 = require("../../database/neonDb");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Explicit boolean conversion with fallback to false
    const useNeon = process.env.USE_NEON === 'true' || false;
    // Dynamically assign the database 
    const db = useNeon ? neonDb_1.neonDb : localDb_1.localDb;
    try {
        // Ensure req.decoded is set by the authorizeUser middleware
        const userId = (_b = (_a = req.decoded) === null || _a === void 0 ? void 0 : _a.userData) === null || _b === void 0 ? void 0 : _b.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID is missing from request" });
        }
        const userToUpdate = req.body;
        if (req.body.currentPassword) {
            const currentPassword = req.body.currentPassword;
            const newPassword = req.body.newPassword;
            // Find the user - it returns an array
            const foundUserArr = yield db.select().from(Users_1.default).where((0, drizzle_orm_1.eq)(Users_1.default.userId, userId));
            if (foundUserArr.length === 0) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            // First user in array
            const foundUser = {
                password: foundUserArr[0].password
            };
            const currentPasswordValid = yield auth_1.auth.validatePassword(currentPassword, foundUser.password);
            if (currentPasswordValid && newPassword) {
                const userToUpdate = req.body;
                // hash password if in req.body
                if (newPassword) {
                    const saltRounds = 5;
                    const passwordHash = yield auth_1.auth.generatePasswordHash(newPassword, saltRounds);
                    userToUpdate.password = passwordHash;
                    console.log(userToUpdate);
                    // response returns as an array with an object
                    const response = yield db.update(Users_1.default)
                        .set(userToUpdate)
                        .where((0, drizzle_orm_1.eq)(Users_1.default.userId, userId))
                        .returning({ updatedUser: Object.assign({}, Users_1.default) });
                    console.log(response);
                    // if response array length is 0, user not found
                    if (response.length === 0) {
                        return res.status(404).json({ success: false, message: "User not found" });
                    }
                    const updatedUser = response[0].updatedUser;
                    return res.status(200).json({ success: true, message: "Successfully updated user password!", updatedUser });
                }
            }
            else {
                return res.status(401).json({ message: "Current password does not match password in database!" });
            }
        }
        else {
            const userToUpdate = req.body;
            if (!userToUpdate.password) {
                // response returns as an array with an object
                const response = yield db.update(Users_1.default)
                    .set(userToUpdate)
                    .where((0, drizzle_orm_1.eq)(Users_1.default.userId, userId))
                    .returning({ updatedUser: Object.assign({}, Users_1.default) });
                console.log(response);
                // if response array length is 0, user not found
                if (response.length === 0) {
                    return res.status(404).json({ success: false, message: "User not found" });
                }
                const updatedUser = response[0].updatedUser;
                return res.status(200).json({ success: true, message: 'User updated successfully.', updatedUser });
            }
            else {
                return res.status(403).json({ message: "New password not hashed!" });
            }
        }
    }
    catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ success: false, message: "Error updating user", error });
    }
});
exports.default = updateUser;
