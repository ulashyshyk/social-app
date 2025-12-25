// apps/backend/src/controllers/auth.controller.ts

import { Request, Response, NextFunction } from 'express';
import User from '../models/User.model.ts';
import { LoginRequest,RegisterRequest,AuthResponse,RefreshTokenRequest,VerifyTokenResponse } from '../../../../packages/shared-types/src/api.types';
import { AuthenticatedUser, UserPayload } from '../../../../packages/shared-types/src/user.types';
import * as authService from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware.ts';

// ========== REGISTER ==========
export const register = async (req: Request<{}, {}, RegisterRequest>,res: Response<AuthResponse>,next: NextFunction) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({message: 'Username, email, and password are required'} as any);
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username: username.toLowerCase() });
    if (existingUsername) {
      return res.status(409).json({message: 'Username already exists'} as any);
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(409).json({message: 'Email already exists'} as any);
    }

    // Hash password
    const hashedPassword = await authService.hashPassword(password);

    // Create user
    const newUser = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      refreshTokens: []
    });

    // Generate tokens
    const accessToken = authService.generateAccessToken(
      newUser._id.toString(),
      newUser.username,
      newUser.email
    );
    const refreshToken = authService.generateRefreshToken(newUser._id.toString());

    // Save refresh token to user
    newUser.refreshTokens.push(refreshToken);
    await newUser.save();

    // Prepare user response
    const user: AuthenticatedUser = {
      _id: newUser._id.toString(),
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.fullName,
      bio: newUser.bio,
      profilePicture: newUser.profilePicture,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    };

    const response: AuthResponse = {
      accessToken,
      refreshToken,
      user
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

// ========== LOGIN ==========
export const login = async (req: Request<{}, {}, { identifier: string; password: string }>,res: Response<AuthResponse>,next: NextFunction) => {
  try {
    const { identifier, password } = req.body;

    // Validate input
    if (!identifier || !password) {
      return res.status(400).json({
        message: 'Email/username and password are required'
      } as any);
    }

    // Check if identifier is email or username
    const isEmail = identifier.includes('@');

    // Find user by email OR username
    const user = await User.findOne({
      $or: [
        { email: isEmail ? identifier.toLowerCase() : null },
        { username: !isEmail ? identifier.toLowerCase() : null }
      ]
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials'
      } as any);
    }

    // Compare password
    const isPasswordValid = await authService.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid credentials'
      } as any);
    }

    // Generate tokens
    const accessToken = authService.generateAccessToken(
      user._id.toString(),
      user.username,
      user.email
    );
    const refreshToken = authService.generateRefreshToken(user._id.toString());

    // Save refresh token
    user.refreshTokens.push(refreshToken);
    await user.save();

    // Prepare user response (removed isVerified)
    const authenticatedUser: AuthenticatedUser = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      bio: user.bio,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    const response: AuthResponse = {
      accessToken,
      refreshToken,
      user: authenticatedUser
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// ========== LOGOUT ==========
export const logout = async (
  req: Request<{}, {}, RefreshTokenRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: 'Refresh token is required'
      });
    }

    const decoded = authService.verifyRefreshToken(refreshToken) as UserPayload;

    // Remove refresh token from user's array
    const user = await User.findById(decoded?.userId).select('+refreshTokens');
    if (user) {
      user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
      await user.save();
    }

    res.status(200).json({
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};


// ========== GET CURRENT USER ==========
export const getCurrentUser = async (req: Request,res: Response<AuthenticatedUser>,next: NextFunction) => {
  try {
    const userId = req.user?._id; // Set by auth middleware

    if (!userId) {
      return res.status(401).json({message: 'Unauthorized'} as any);
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: 'User not found'} as any);
    }

    const authenticatedUser: AuthenticatedUser = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      bio: user.bio,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(200).json(authenticatedUser);
  } catch (error) {
    next(error);
  }
};

// ========== REFRESH TOKEN ==========
export const refresh = async (req: Request<{}, {}, RefreshTokenRequest>,res: Response<AuthResponse>,next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({message: 'Refresh token is required'} as any);
    }

    // Verify refresh token
    const decoded = authService.verifyRefreshToken(refreshToken) as UserPayload;

    // Find user and check if token exists in their array
    const user = await User.findById(decoded?.userId).select('+refreshTokens');
    if (!user) {
      return res.status(401).json({message: 'Invalid refresh token'} as any);
    }

    if (!user.refreshTokens.includes(refreshToken)) {
      return res.status(401).json({message: 'Refresh token not found or already used'} as any);
    }

    // Generate new tokens (token rotation)
    const newAccessToken = authService.generateAccessToken(
      user._id.toString(),
      user.username,
      user.email
    );
    const newRefreshToken = authService.generateRefreshToken(user._id.toString());

    // Remove old refresh token and add new one
    user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    // Prepare user response
    const authenticatedUser: AuthenticatedUser = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      bio: user.bio,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    const response: AuthResponse = {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: authenticatedUser
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// ========== VERIFY TOKEN ==========
export const verifyToken = async (req: Request,res: Response<VerifyTokenResponse>,next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(200).json({valid: false});
    }

    const decoded = authService.verifyAccessToken(token) as UserPayload;
    const user = await User.findById(decoded?.userId);

    if (!user) {
      return res.status(200).json({valid: false});
    }

    const authenticatedUser: AuthenticatedUser = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      bio: user.bio,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(200).json({
      valid: true,
      user: authenticatedUser
    });
  } catch (error) {
    res.status(200).json({valid: false});
  }
};
