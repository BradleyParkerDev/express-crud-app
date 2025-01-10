"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
// Auth API
router.post("/login-user", controllers_1.authController.loginUser);
router.post("/logout-user", controllers_1.authController.logoutUser);
exports.default = router;
