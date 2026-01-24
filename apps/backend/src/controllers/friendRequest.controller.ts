// controllers/friendRequest.controller.ts

import { Request, Response } from 'express';
import {FriendRequest} from '../models/FriendRequest.model';
import User from '../models/User.model';

// Send friend request
export const sendFriendRequest = async (req: Request, res: Response) => {
    try {
        const requesterId = req.user?.userId;
        const { recipientId } = req.body;

        // Validate recipient exists
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if already friends
        const requester = await User.findById(requesterId);
        if (requester?.friends.includes(recipientId)) {
            return res.status(400).json({ message: 'Already friends' });
        }

        // Check for existing request (either direction)
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { requesterId, recipientId },
                { requesterId: recipientId, recipientId: requesterId }
            ],
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'Friend request already exists' });
        }

        // Create request
        const friendRequest = await FriendRequest.create({
            requesterId,
            recipientId
        });

        res.status(201).json(friendRequest);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get received requests
export const getReceivedRequests = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        const status = req.query.status || 'pending';

        const requests = await FriendRequest.find({
            recipientId: userId,
            status
        })
        .populate('requesterId', 'username fullName profilePicture')
        .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get sent requests
export const getSentRequests = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        const status = req.query.status || 'pending';

        const requests = await FriendRequest.find({
            requesterId: userId,
            status
        })
        .populate('recipientId', 'username fullName profilePicture')
        .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Accept friend request
export const acceptFriendRequest = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { requestId } = req.params;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found' });
        }

        // Verify user is the recipient
        if (friendRequest.recipientId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (friendRequest.status !== 'pending') {
            return res.status(400).json({ message: 'Request already processed' });
        }

        // Update request status
        friendRequest.status = 'accepted';
        await friendRequest.save();

        // Add to friends list (bidirectional)
        await User.findByIdAndUpdate(friendRequest.requesterId, {
            $addToSet: { friends: friendRequest.recipientId }
        });

        await User.findByIdAndUpdate(friendRequest.recipientId, {
            $addToSet: { friends: friendRequest.requesterId }
        });

        res.json({ message: 'Friend request accepted', friendRequest });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Reject friend request
export const rejectFriendRequest = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { requestId } = req.params;

        const friendRequest = await FriendRequest.findById(requestId);

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found' });
        }

        // Verify user is the recipient
        if (friendRequest.recipientId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (friendRequest.status !== 'pending') {
            return res.status(400).json({ message: 'Request already processed' });
        }

        friendRequest.status = 'rejected';
        await friendRequest.save();

        res.json({ message: 'Friend request rejected' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Cancel sent request
export const cancelFriendRequest = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { requestId } = req.params;

        const friendRequest = await FriendRequest.findById(requestId);

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found' });
        }

        // Verify user is the requester
        if (friendRequest.requesterId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await FriendRequest.findByIdAndDelete(requestId);

        res.json({ message: 'Friend request cancelled' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get friendship status with a user
export const getFriendshipStatus = async (req: Request, res: Response) => {
    try {
        const currentUserId = req.user?.userId;
        const { userId } = req.params;

        // Check if friends
        const currentUser = await User.findById(currentUserId);
        if (currentUser?.friends.includes(userId as any)) {
            return res.json({ status: 'friends' });
        }

        // Check for pending request
        const sentRequest = await FriendRequest.findOne({
            requesterId: currentUserId,
            recipientId: userId,
            status: 'pending'
        });

        if (sentRequest) {
            return res.json({ status: 'request_sent' });
        }

        const receivedRequest = await FriendRequest.findOne({
            requesterId: userId,
            recipientId: currentUserId,
            status: 'pending'
        });

        if (receivedRequest) {
            return res.json({ status: 'request_received', requestId: receivedRequest._id });
        }

        res.json({ status: 'none' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get friends list
export const getFriends = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;

        const user = await User.findById(userId)
            .populate('friends', 'username fullName profilePicture bio');

        res.json(user?.friends || []);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
