"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
// Multer setup
// upload to memory
const storage = multer_1.default.memoryStorage();
// upload to project directory
// const storage = multer.diskStorage({
//     destination: (req, file, cb)=>{
//         cb(null, 'my-images/')
//     },
//     filename: (req, file, cb)=>{
//         cb(null, file.originalname)
//     }
// })
const upload = (0, multer_1.default)({ storage: storage });
// Define routes
router.post("/delete-user-image", controllers_1.imagesController.deleteUserImage);
router.post("/upload-user-image", upload.single("file"), controllers_1.imagesController.uploadUserImage);
exports.default = router;
