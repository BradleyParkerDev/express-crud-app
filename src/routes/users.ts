import express from 'express';
const router = express.Router();
import { usersController } from '../controllers';

// User API
router.post('/register-user', usersController.registerUser) 
router.get('/get-user',usersController.getUser) 
router.put('/update-user',usersController.updateUser) 
router.delete('/delete-user',usersController.deleteUser) 

export default router;
