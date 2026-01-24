// routes/friendRequest.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as friendRequestController from '../controllers/friendRequest.controller';

const router = Router();


// Send friend request
router.post('/', authMiddleware, friendRequestController.sendFriendRequest);

// Get requests
router.get('/received', authMiddleware, friendRequestController.getReceivedRequests);
router.get('/sent', authMiddleware, friendRequestController.getSentRequests);

// Get friendship status with a specific user
router.get('/status/:userId', authMiddleware, friendRequestController.getFriendshipStatus);

// Get user's friends list
router.get('/friends', authMiddleware, friendRequestController.getFriends);

// Handle requests
router.patch('/:requestId/accept', authMiddleware, friendRequestController.acceptFriendRequest);
router.patch('/:requestId/reject', authMiddleware, friendRequestController.rejectFriendRequest);
router.delete('/:requestId', authMiddleware, friendRequestController.cancelFriendRequest);

export default router;
