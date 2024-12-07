"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const controllers_1 = require("../controllers");
// Auth API
router.post("/login-user", controllers_1.authController.loginUser);
router.post("/logout-user", controllers_1.authController.logoutUser);
exports.default = router;