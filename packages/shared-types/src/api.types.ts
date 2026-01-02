// packages/shared-types/src/api.types.ts

import { AuthenticatedUser } from './user.types';

// ========== AUTH REQUESTS ==========

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// ========== AUTH RESPONSES ==========

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthenticatedUser;
}

export interface VerifyTokenResponse {
  valid: boolean;
  user?: AuthenticatedUser;
}

// ========== GENERIC API RESPONSES ==========

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string>; // Field-specific errors like { email: "Email already exists" }
}

export interface ApiSuccess<T = any> {
  success: true;
  data: T;
  message?: string;
}
