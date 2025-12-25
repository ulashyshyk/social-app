import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.ts';

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

function generateAccessToken(userId: string, username: string, email: string): string {
    return jwt.sign({ id: userId, username, email }, jwtSecret, { expiresIn: jwtExpiresIn });
}

function generateRefreshToken(userId: string): string {
    return jwt.sign({ id: userId }, jwtSecret, { expiresIn: refreshTokenExpiresIn });
}

function verifyRefreshToken(token: string) {
    try {
        return jwt.verify(token, jwtSecret);
    } catch (err) {
        return null
    }
}

export { hashPassword, comparePassword, generateAccessToken, generateRefreshToken, verifyRefreshToken };