import { Router } from 'express';
import * as ctrlAuth from '../controllers/auth.controller.ts';
import { authMiddleware } from '../middlewares/auth.middleware.ts';

const router = Router()

router.post('/register', ctrlAuth.register);

router.post('/login', ctrlAuth.login);

router.post('/logout', authMiddleware, ctrlAuth.logout);

router.post('/refresh', ctrlAuth.refresh);

router.get('/currentUser', authMiddleware, ctrlAuth.getCurrentUser);

router.post('/verify-token', ctrlAuth.verifyToken);

export default router;