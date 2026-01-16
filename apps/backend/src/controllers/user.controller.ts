import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import * as userService from '../services/user.service';
import { UpdateProfileRequest } from '../../../../packages/shared-types/src/user.types';
import { uploadProfilePicture, deleteCloudinaryImage } from '../../../backend/src/config/cloudinary';
import User from '../models/User.model';

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
    const { fullName, bio } = req.body;
    
    // Validate bio length
    if (bio && bio.length > 160) {
      res.status(400).json({ error: 'Bio must be 160 characters or less' });
      return;
    }

    // Build update data
    const data: UpdateProfileRequest = {};
    if (fullName !== undefined) data.fullName = fullName;
    if (bio !== undefined) data.bio = bio;

    // If file was uploaded, upload to Cloudinary
    if (req.file) {
      try {
        // Get current user to delete old image
        const currentUser = await User.findById(req.user!.userId);
        
        // Upload new image to Cloudinary
        const { url } = await uploadProfilePicture(req.file.buffer, req.user!.userId);
        data.profilePicture = url;

        // Delete old profile picture from Cloudinary if exists
        if (currentUser?.profilePicture) {
          await deleteCloudinaryImage(currentUser.profilePicture);
        }
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        res.status(500).json({ error: 'Failed to upload image' });
        return;
      }
    }

    const user = await userService.updateMe(req.user!.userId, data);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const getUserById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    console.log('params: ', req.params);
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