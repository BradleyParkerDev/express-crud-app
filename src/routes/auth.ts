import express from 'express';
import { authController } from '../controllers';
const router = express.Router();

// Auth API
router.post("/login-user", authController.loginUser)
router.post("/logout-user", authController.logoutUser)

export default router;