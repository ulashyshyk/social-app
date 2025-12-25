// apps/backend/src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserPayload } from '../../../../packages/shared-types/src/user.types';

export async function authMiddleware(
    req: Request,  // Just use Request, not AuthRequest
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
