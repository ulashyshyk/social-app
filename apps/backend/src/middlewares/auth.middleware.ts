// apps/backend/src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserPayload } from '../../../../packages/shared-types/src/user.types';

export interface AuthenticatedRequest extends Request {
    user?: UserPayload;
}

export async function authMiddleware(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Invalid authorization format' });
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as UserPayload;
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

export const optionalAuth = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (token) {
        const decoded = jwt.verify(token, env.JWT_SECRET!) as UserPayload;
        req.user = decoded; 
      }
    } catch (error) {
      // Invalid/expired token - just continue without user
    }
    
    next();
  };