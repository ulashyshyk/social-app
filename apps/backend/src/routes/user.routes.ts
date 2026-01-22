import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as userController from '../controllers/user.controller';
import upload from '../config/upload';

const router = Router();

// PROTECTED ROUTES
router.get('/me', authMiddleware, userController.getMe);
router.patch('/me', authMiddleware, upload.single('profilePicture'), userController.updateMe);

// PUBLIC ROUTES
router.get('/username/:username', userController.getUserByUsername);
router.get('/:id', userController.getUserById);

export default router;
