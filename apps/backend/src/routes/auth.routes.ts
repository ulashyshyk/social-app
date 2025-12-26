import { Router } from 'express';
import * as ctrlAuth from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router()

router.post('/register', ctrlAuth.register);

router.post('/login', ctrlAuth.login);

router.post('/logout', authMiddleware, ctrlAuth.logout);

router.post('/refresh', ctrlAuth.refresh);

router.get('/currentUser', authMiddleware, ctrlAuth.getCurrentUser);

router.post('/verify-token', ctrlAuth.verifyToken);

router.post('/check-email', ctrlAuth.checkEmail);

export default router;
