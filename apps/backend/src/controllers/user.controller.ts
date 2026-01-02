import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import * as userService from '../services/user.service';
import { UpdateProfileRequest } from '../../../../packages/shared-types/src/user.types';

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await userService.getMe(req.user!.userId);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Get me error:', error); 
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

export const updateMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const data: UpdateProfileRequest = req.body;
      
      if (data.bio && data.bio.length > 160) {
        res.status(400).json({ error: 'Bio must be 160 characters or less' });
        return;
      }
  
      const user = await userService.updateMe(req.user!.userId, data);
  
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  };
  

export const getUserById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    console.log('params: ',req.params);
    const { id } = req.params;
    const user = await userService.getUserById(id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.log("Get User by ID Error:",error)
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};