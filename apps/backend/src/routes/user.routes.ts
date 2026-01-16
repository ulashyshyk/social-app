import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as userController from '../controllers/user.controller';
import upload from '../config/upload';

const router = Router();

// PUBLIC ROUTES
router.get('/:id', userController.getUserById);

// PROTECTED ROUTES
router.get('/me', authMiddleware, userController.getMe);
router.patch('/me', authMiddleware, upload.single('profilePicture'), userController.updateMe);

export default router;
