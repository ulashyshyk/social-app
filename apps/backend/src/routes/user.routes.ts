// apps/backend/src/routes/user.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getMe, updateMe, getUserById } from '../controllers/user.controller';

const router = Router();

// Protected routes - authenticated user's own profile
router.get('/me', authMiddleware, getMe);
router.patch('/me', authMiddleware, updateMe);

// Public route - view any user's profile
router.get('/:id', getUserById);

export default router;
