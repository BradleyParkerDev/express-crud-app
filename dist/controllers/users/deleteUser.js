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
const localDb_1 = require("../../database/localDb");
const neonDb_1 = require("../../database/neonDb");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Explicit boolean conversion with fallback to false
    const useNeon = process.env.USE_NEON === 'true' || false;
    // Dynamically assign the database 
    const db = useNeon ? neonDb_1.neonDb : localDb_1.localDb;
    try {
        // Ensure req.decoded is set by the authorizeUser middleware
        const id = (_b = (_a = req.decoded) === null || _a === void 0 ? void 0 : _a.userData) === null || _b === void 0 ? void 0 : _b.userId;
        if (!id) {
            return res.status(400).json({ message: "User ID is missing from request" });
        }
        // returns an array
        const response = yield db.delete(Users_1.default).where((0, drizzle_orm_1.eq)(Users_1.default.userId, id)).returning();
        // if response is greater than 0 the user has been deleted
        if (response.length > 0) {
            res.json({ message: 'User successfully deleted!', response: response[0] });
        }
        else {
            res.json({ message: 'User not deleted!' });
        }
    }
    catch (error) {
        res.json({ message: 'Error deleting user!', error: error });
    }
});
exports.default = deleteUser;
