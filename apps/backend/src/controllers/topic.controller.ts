import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { uploadImage } from '../services/upload.service';
import * as topicService from '../services/topic.service';
import Topic from '../models/Topic.model';

export const getAllTopics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    if (page < 1) {
      res.status(400).json({ message: 'Page must be at least 1' });
      return;
    }

    if (limit < 1 || limit > 100) {
      res.status(400).json({ message: 'Limit must be between 1 and 100' });
      return;
    }

    const result = await topicService.getAllTopics(userId, category, search, page, limit);

    res.json(result);
  } catch (error: any) {
    console.error('Get all topics error:', error);
    res.status(500).json({ message: 'Failed to fetch topics' });
  }
};

export const getTopicById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const topic = await topicService.getTopicById(id, userId);

    res.json(topic);
  } catch (error: any) {
    console.error('Get topic by ID error:', error);

    if (error.message === 'Topic not found') {
      res.status(404).json({ message: error.message });
    } else if (error.message === 'Invalid topic ID') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to fetch topic' });
    }
  }
};

export const createTopic = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, content, category } = req.body;
    const userId = req.user!.userId;

    // Basic validation
    if (!title || !content || !category) {
      res.status(400).json({ message: 'Title, content, and category are required' });
      return;
    }

    if (title.length > 120) {
      res.status(400).json({ message: 'Title must be 120 characters or less' });
      return;
    }

    if (content.length > 5000) {
      res.status(400).json({ message: 'Content must be 5000 characters or less' });
      return;
    }

    const validCategories = ['Education', 'Tourism', 'Business', 'Culture', 'Sports', 'Entertainment'];
    if (!validCategories.includes(category)) {
      res.status(400).json({ message: 'Invalid category' });
      return;
    }

    // Get uploaded files from multer and upload to Cloudinary
    const files = (req.files as Express.Multer.File[]) || [];

    if (files.length > 5) {
      res.status(400).json({ message: 'You can upload up to 5 images' });
      return;
    }

    const uploadedUrls = await Promise.all(
      files.map((file) => uploadImage(file.path))
    );

    // Call service to create topic (images are Cloudinary URLs)
    const topic = await topicService.createTopic(
      { title, content, category, images: uploadedUrls },
      userId
    );

    res.status(201).json(topic);
  } catch (error: any) {
    console.error('Create topic error:', error);
    res.status(500).json({ message: 'Failed to create topic' });
  }
};

export const updateTopic = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;
    const userId = req.user!.userId;

    const files = (req.files as Express.Multer.File[]) || [];

    // Validate if at least one field is provided (or new images)
    if (!title && !content && !category && files.length === 0) {
      res.status(400).json({ message: 'At least one field (title, content, category, or images) is required' });
      return;
    }

    // Validate field lengths if provided
    if (title && title.length > 120) {
      res.status(400).json({ message: 'Title must be 120 characters or less' });
      return;
    }

    if (content && content.length > 5000) {
      res.status(400).json({ message: 'Content must be 5000 characters or less' });
      return;
    }

    if (category) {
      const validCategories = ['Education', 'Tourism', 'Business', 'Culture', 'Sports', 'Entertainment'];
      if (!validCategories.includes(category)) {
        res.status(400).json({ message: 'Invalid category' });
        return;
      }
    }

    let uploadedUrls: string[] | undefined;
    if (files.length) {
      if (files.length > 5) {
        res.status(400).json({ message: 'You can upload up to 5 images' });
        return;
      }

      uploadedUrls = await Promise.all(
        files.map((file) => uploadImage(file.path))
      );
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (category) updateData.category = category;
    if (uploadedUrls) updateData.images = uploadedUrls;

    const topic = await topicService.updateTopic(id, updateData, userId);

    res.json(topic);
  } catch (error: any) {
    console.error('Update topic error:', error);

    if (error.message === 'Topic not found') {
      res.status(404).json({ message: error.message });
    } else if (error.message === 'Not authorized to update this topic') {
      res.status(403).json({ message: error.message });
    } else if (error.message === 'Invalid topic ID') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to update topic' });
    }
  }
};

export const deleteTopic = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    await topicService.deleteTopic(id, userId);

    res.json({ message: 'Topic deleted successfully' });
  } catch (error: any) {
    console.error('Delete topic error:', error);

    if (error.message === 'Topic not found') {
      res.status(404).json({ message: error.message });
    } else if (error.message === 'Not authorized to delete this topic') {
      res.status(403).json({ message: error.message });
    } else if (error.message === 'Invalid topic ID') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to delete topic' });
    }
  }
};

export const likeTopic = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const result = await topicService.likeTopic(id, userId);

    res.json(result);
  } catch (error: any) {
    console.error('Like topic error:', error);

    if (error.message === 'Topic not found') {
      res.status(404).json({ message: error.message });
    } else if (error.message === 'Topic already liked') {
      res.status(400).json({ message: error.message });
    } else if (error.message === 'Invalid topic ID') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to like topic' });
    }
  }
};

export const unlikeTopic = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const result = await topicService.unlikeTopic(id, userId);

    res.json(result);
  } catch (error: any) {
    console.error('Unlike topic error:', error);

    if (error.message === 'Topic not found') {
      res.status(404).json({ message: error.message });
    } else if (error.message === 'Invalid topic ID') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to unlike topic' });
    }
  }
};
