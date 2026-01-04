import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as userController from '../controllers/user.controller';

const router = Router();

// PUBLIC ROUTES
router.get('/:id', userController.getUserById);

// PROTECTED ROUTES
router.get('/me', authMiddleware, userController.getMe);
router.patch('/me', authMiddleware, userController.updateMe);

export default router;
