import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import User from '../models/User.model';
import { AuthenticatedUser, UserPayload } from '../../../../packages/shared-types/src/user.types.ts';

export interface AuthRequest extends Request {
    user?: AuthenticatedUser;
}

export async function authMiddleware(
    req: AuthRequest,
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
        // verify token
        const decoded = jwt.verify(token, env.JWT_SECRET) as UserPayload;

        // find user from db
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // adding user to req
        req.user = user as AuthenticatedUser;

        next();
    } catch {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}
