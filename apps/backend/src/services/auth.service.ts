import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import User from '../models/User.model';

const jwtSecret = env.JWT_SECRET;
const jwtExpiresIn = '1h';
const refreshTokenExpiresIn = '7d';
const saltRounds = 10;
    
async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, saltRounds);
}

async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

async function isEmailRegistered(email: string): Promise<boolean> {
  const user = await User.findOne({ email: email.toLowerCase() });
  return !!user;
}

function generateAccessToken(userId: string, username: string, email: string): string {
    return jwt.sign({ userId, username, email }, jwtSecret, { expiresIn: jwtExpiresIn });
}

function generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, jwtSecret, { expiresIn: refreshTokenExpiresIn });
}

function verifyAccessToken(token: string) {
    try {
        return jwt.verify(token, jwtSecret);
    } catch (err) {
        return null;
    }
}

function verifyRefreshToken(token: string) {
    try {
        return jwt.verify(token, jwtSecret);
    } catch (err) {
        return null
    }
}

export { hashPassword, comparePassword, isEmailRegistered, generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };
