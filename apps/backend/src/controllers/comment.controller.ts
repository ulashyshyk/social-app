// apps/backend/src/controllers/comment.controller.ts

import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import * as commentService from '../services/comment.service';

const MAX_COMMENT_LENGTH = 2000;

export const getComments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { topicId } = req.params;

    const comments = await commentService.getCommentsByTopic(topicId);

    res.json(comments);
  } catch (error: any) {
    console.error('Get comments error:', error);

    if (error.message === 'Invalid topic ID') {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

export const createComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { topicId } = req.params;
    const { content } = req.body;
    const userId = req.user!.userId;

    if (!content || !content.trim()) {
      res.status(400).json({ message: 'Content is required' });
      return;
    }

    if (content.length > MAX_COMMENT_LENGTH) {
      res
        .status(400)
        .json({ message: `Content must be ${MAX_COMMENT_LENGTH} characters or less` });
      return;
    }

    const comment = await commentService.createComment(topicId, content, userId);

    res.status(201).json(comment);
  } catch (error: any) {
    console.error('Create comment error:', error);

    if (error.message === 'Invalid topic ID') {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: 'Failed to create comment' });
  }
};

export const updateComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user!.userId;

    if (!content || !content.trim()) {
      res.status(400).json({ message: 'Content is required' });
      return;
    }

    if (content.length > MAX_COMMENT_LENGTH) {
      res
        .status(400)
        .json({ message: `Content must be ${MAX_COMMENT_LENGTH} characters or less` });
      return;
    }

    const comment = await commentService.updateComment(id, content, userId);

    res.json(comment);
  } catch (error: any) {
    console.error('Update comment error:', error);

    if (error.message === 'Comment not found') {
      res.status(404).json({ message: error.message });
      return;
    }
    if (error.message === 'Not authorized to update this comment') {
      res.status(403).json({ message: error.message });
      return;
    }
    if (error.message === 'Invalid comment ID') {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: 'Failed to update comment' });
  }
};

export const deleteComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    await commentService.deleteComment(id, userId);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error: any) {
    console.error('Delete comment error:', error);

    if (error.message === 'Comment not found') {
      res.status(404).json({ message: error.message });
      return;
    }
    if (error.message === 'Not authorized to delete this comment') {
      res.status(403).json({ message: error.message });
      return;
    }
    if (error.message === 'Invalid comment ID') {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: 'Failed to delete comment' });
  }
};
