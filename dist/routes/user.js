"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const controllers_1 = require("../controllers");
// User API
router.delete('/delete-user', controllers_1.userController.deleteUser);
router.get('/get-user', controllers_1.userController.getUser);
router.post('/register-user', controllers_1.userController.registerUser);
router.put('/update-user', controllers_1.userController.updateUser);
exports.default = router;
