'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../../../packages/api-client/src/auth.api';
import { LoginRequest, RegisterRequest, AuthResponse } from '../../../packages/shared-types/src/api.types';
import { AuthenticatedUser } from '../../../packages/shared-types/src/user.types';

interface AuthContextType {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkEmail: (email: string) => Promise<boolean>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount (page reload)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          // Verify token is still valid by fetching current user
          const user = await authApi.getCurrentUser();
          setUser(user);
        }
      } catch (error) {
        // Token invalid or expired, clear it
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await authApi.login(credentials);
    
    // Store tokens
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    
    // Set user state
    setUser(response.user);
    
    // Close modal
    closeAuthModal();
  };

  const register = async (data: RegisterRequest) => {
    const response = await authApi.register(data);
    
    // Store tokens
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    
    // Set user state
    setUser(response.user);
    
    // Close modal
    closeAuthModal();
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens and user state regardless of API call success
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  const checkEmail = async (email: string): Promise<boolean> => {
    const result = await authApi.checkEmail(email);
    return result.exists;
  };
  
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    isLoading,
    checkEmail
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}