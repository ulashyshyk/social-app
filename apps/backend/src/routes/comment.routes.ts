// apps/backend/src/routes/comment.routes.ts

import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as commentController from '../controllers/comment.controller';

const router = Router();

// PUBLIC ROUTES
router.get('/:topicId', commentController.getComments);

// PROTECTED ROUTES
router.post('/:topicId', authMiddleware, commentController.createComment); 
router.put('/:id', authMiddleware, commentController.updateComment);
router.delete('/:id', authMiddleware, commentController.deleteComment);
router.post('/:id/replies', authMiddleware, commentController.createReply);
router.post('/:id/like', authMiddleware, commentController.likeComment);
router.delete('/:id/like', authMiddleware, commentController.unlikeComment);

export default router;
