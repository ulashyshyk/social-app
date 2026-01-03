'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../../../packages/api-client/src/auth.api';
import { userApi } from '../../../packages/api-client/src/user.api';
import { LoginRequest, RegisterRequest } from '../../../packages/shared-types/src/api.types';
import { AuthenticatedUser, UpdateProfileRequest } from '../../../packages/shared-types/src/user.types';

type PendingAction = {
  type: 
    // Topic Actions
    | 'LIKE_TOPIC'
    | 'UNLIKE_TOPIC'
    | 'CREATE_TOPIC'
    | 'EDIT_TOPIC'
    | 'DELETE_TOPIC'
    | 'CREATE_COMMENT'
    | 'EDIT_COMMENT'
    | 'DELETE_COMMENT'
    | 'LIKE_COMMENT'
    | 'UNLIKE_COMMENT'
    | 'REPLY_TO_COMMENT'
    
    // Friend Actions
    | 'SEND_FRIEND_REQUEST'
    | 'ACCEPT_FRIEND_REQUEST'
    | 'REJECT_FRIEND_REQUEST'
    | 'REMOVE_FRIEND'
    | 'BLOCK_USER'
    
    // Messaging Actions
    | 'SEND_MESSAGE'
    | 'START_CONVERSATION'
    | 'DELETE_CONVERSATION';
    
    // Optional Future Actions (commented out for now)
    // | 'FOLLOW_USER'
    // | 'UNFOLLOW_USER'
    // | 'SAVE_TOPIC'
    // | 'UNSAVE_TOPIC'
    // | 'REPORT_CONTENT';
    
  payload: any;
  callback?: () => void; // Function to execute after login
} | null;

interface AuthContextType {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkEmail: (email: string) => Promise<boolean>;
  updateProfile: (updateData: UpdateProfileRequest) => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isLoading: boolean;
  requireAuth: (action?: PendingAction) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //State to store the action user tried to do before logging in( EXAMPLE:like a comment, add a friend, open messages tab )
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  // Check if user is logged in on mount (page reload)
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
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

  //Function to execute the saved pending action after successful login/register
  const executePendingAction = () => {
    // If there's a pending action with a callback function
    if (pendingAction?.callback) {
      pendingAction.callback(); // Execute the saved callback
    }
    setPendingAction(null); // Clear the pending action
  };

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);
    
      // Store tokens
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      // Set user state
      setUser(response.user);
      
      closeAuthModal();

      //Execute the pending action after successful login
      executePendingAction();
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(data);
      
      // Store tokens
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      // Set user state
      setUser(response.user);
      
      closeAuthModal();

      //Execute the pending action after successful registration
      executePendingAction();
    } finally {
      setIsLoading(false);
    }
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
      //Clear any pending actions when user logs out
      setPendingAction(null);
    }
  };

  const checkEmail = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await authApi.checkEmail(email);
      return result.exists;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updateData: UpdateProfileRequest) => {
    try {
      const updated = await userApi.updateMe(updateData);
      setUser(updated);  // Update the same user state
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  //Function to check if user is authenticated before performing an action
  const requireAuth = (action?: PendingAction): boolean => {
    // If user is NOT logged in
    if (!user) {
      // Save the action if one was provided
      if (action) {
        setPendingAction(action);
      }

      openAuthModal();
      // Return false to tell the caller to stop execution
      return false;
    }
    // User IS logged in, action can proceed
    return true;
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
    checkEmail,
    updateProfile,
    requireAuth, // ADDED: Export requireAuth so components can use it
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
