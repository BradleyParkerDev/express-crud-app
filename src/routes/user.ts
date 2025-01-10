import express from 'express';
const router = express.Router();
import { userController } from '../controllers';

// User API
router.delete('/delete-user',userController.deleteUser) 
router.get('/get-user',userController.getUser) 
router.post('/register-user', userController.registerUser) 
router.put('/update-user',userController.updateUser) 


export default router;
