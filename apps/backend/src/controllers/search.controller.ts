import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import * as searchService from '../services/search.service';

export const searchAll = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const query = (req.query.q as string)?.trim() || '';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const userId = req.user?.userId;

    if (page < 1) {
      res.status(400).json({ message: 'Page must be at least 1' });
      return;
    }

    if (limit < 1 || limit > 50) {
      res.status(400).json({ message: 'Limit must be between 1 and 50' });
      return;
    }

    const results = await searchService.searchAll(query, userId, page, limit);

    res.json(results);
  } catch (error: any) {
    console.error('Search all error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
};

export const searchTopics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const query = (req.query.q as string)?.trim() || '';
    const category = req.query.category as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const userId = req.user?.userId;

    if (page < 1) {
      res.status(400).json({ message: 'Page must be at least 1' });
      return;
    }

    if (limit < 1 || limit > 100) {
      res.status(400).json({ message: 'Limit must be between 1 and 100' });
      return;
    }

    const results = await searchService.searchTopics(query, category, userId, page, limit);

    res.json(results);
  } catch (error: any) {
    console.error('Search topics error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
};

export const searchUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const query = (req.query.q as string)?.trim() || '';
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

    const results = await searchService.searchUsers(query, page, limit);

    res.json(results);
  } catch (error: any) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
};
