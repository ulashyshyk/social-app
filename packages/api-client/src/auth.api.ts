// packages/api-client/src/auth.api.ts

import apiClient from './http';
import { LoginRequest, RegisterRequest, AuthResponse,RefreshTokenRequest} from '../../shared-types/src/api.types';
import { AuthenticatedUser } from '../../shared-types/src/user.types';

export const authApi = {
  // Login
  login: async (credentials: { identifier: string; password: string }): Promise<AuthResponse> => {
    try {
      const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message);
    }
  },

  // Register
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      const { data } = await apiClient.post<AuthResponse>('/auth/register', userData);      
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message)
    }
  },

  // Refresh token
  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
    return data;
  },

  // Logout
  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post('/auth/logout', { refreshToken });
  },

  // Get current user
  getCurrentUser: async (): Promise<AuthenticatedUser> => {
    const { data } = await apiClient.get<AuthenticatedUser>('/auth/me');
    return data;
  },

  // Verify token
  verifyToken: async (): Promise<{ valid: boolean; user?: AuthenticatedUser }> => {
    const { data } = await apiClient.get('/auth/verifyToken');
    return data;
  },

  //check-email
  checkEmail: async (email: string): Promise<{ exists: boolean }> => {
    try {
      const { data } = await apiClient.post<{ exists: boolean }>('/auth/check-email', { email });
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message);
    }
  },
};
