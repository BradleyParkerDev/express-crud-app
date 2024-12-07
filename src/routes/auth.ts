import express from 'express';
const router = express.Router();
import { authController } from '../controllers';

// Auth API
router.post("/login-user", authController.loginUser)
router.post("/logout-user", authController.logoutUser)

export default router;