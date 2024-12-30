import express from "express";
import multer from "multer";
import { imagesController } from "../controllers";

const router = express.Router();

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Define routes
router.post("/delete-user-image", imagesController.deleteUserImage);
router.post("/upload-user-image", upload.single("image"), imagesController.uploadUserImage);

export default router;

