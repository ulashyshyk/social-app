// packages/api-client/src/auth.api.ts

import apiClient from './http.ts';
import { LoginRequest, RegisterRequest, AuthResponse,RefreshTokenRequest} from '../../shared-types/src/api.types.ts';
import { AuthenticatedUser } from '../../shared-types/src/user.types.ts';

export const authApi = {
  // Login
  login: async (credentials: { identifier: string; password: string }): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
    return data;
  },

  // Register
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/api/auth/register', userData);
    return data;
  },

  // Refresh token
  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/api/auth/refresh', { refreshToken });
    return data;
  },

  // Logout
  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post('/api/auth/logout', { refreshToken });
  },

  // Get current user
  getCurrentUser: async (): Promise<AuthenticatedUser> => {
    const { data } = await apiClient.get<AuthenticatedUser>('/api/auth/me');
    return data;
  },

  // Verify token
  verifyToken: async (): Promise<{ valid: boolean; user?: AuthenticatedUser }> => {
    const { data } = await apiClient.get('/api/auth/verify');
    return data;
  }
};
