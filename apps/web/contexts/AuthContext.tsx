"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authApi } from "../../../packages/api-client/src/auth.api";
import { userApi } from "../../../packages/api-client/src/user.api";
import {
  LoginRequest,
  RegisterRequest,
} from "../../../packages/shared-types/src/api.types";
import {
  AuthenticatedUser,
  UpdateProfileRequest,
} from "../../../packages/shared-types/src/user.types";

type PendingAction = {
  type:
    // Topic Actions
    | "LIKE_TOPIC"
    | "UNLIKE_TOPIC"
    | "CREATE_TOPIC"
    | "EDIT_TOPIC"
    | "DELETE_TOPIC"
    | "CREATE_COMMENT"
    | "EDIT_COMMENT"
    | "DELETE_COMMENT"
    | "LIKE_COMMENT"
    | "UNLIKE_COMMENT"
    | "REPLY_TO_COMMENT"
    // Friend Actions
    | "SEND_FRIEND_REQUEST"
    | "ACCEPT_FRIEND_REQUEST"
    | "REJECT_FRIEND_REQUEST"
    | "REMOVE_FRIEND"
    | "BLOCK_USER"
    // Messaging Actions
    | "SEND_MESSAGE"
    | "START_CONVERSATION"
    | "DELETE_CONVERSATION";
  payload: any;
  callback?: () => void;
} | null;

interface AuthContextType {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkEmail: (email: string) => Promise<boolean>;
  updateProfile: (updateData: UpdateProfileRequest) => Promise<void>;
  updateProfileWithFile: (formData: FormData) => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isLoading: boolean;
  requireAuth: (action?: PendingAction) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  // Check if user is logged in on mount (page reload)
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          // Verify token is still valid by fetching current user
          const user = await authApi.getCurrentUser();
          setUser(user);
        }
      } catch (error) {
        // Token invalid or expired, clear it
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Function to execute the saved pending action after successful login/register
  const executePendingAction = () => {
    if (pendingAction?.callback) {
      pendingAction.callback();
    }
    setPendingAction(null);
  };

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      setUser(response.user);
      closeAuthModal();
      
      // If we are on mainpage reload, else redirect or pending action
      if (pathname === "/") {
        window.location.reload();
      } else if (pendingAction) {
        executePendingAction();
      } else {
        router.push('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(data);
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      setUser(response.user);
      closeAuthModal();
      
      // If we are on mainpage reload, else redirect or pending action
      if (pathname === "/") {
        window.location.reload();
      } else if (pendingAction) {
        executePendingAction();
      } else {
        router.push('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear tokens and user state
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setPendingAction(null);
      
      // If we are already in mainpage reload the page, then redirect to mainpage
      if (pathname === "/") {
        window.location.reload();
      } else {
        router.push('/');
      }
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
      setUser(updated);
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  };

  const updateProfileWithFile = async (formData: FormData): Promise<void> => {
    try {
      const updatedUser = await userApi.updateMeWithFile(formData);
      setUser(updatedUser);
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  };

  // Function to check if user is authenticated before performing an action
  const requireAuth = (action?: PendingAction): boolean => {
    if (!user) {
      if (action) {
        setPendingAction(action);
      }
      openAuthModal();
      return false;
    }
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
    updateProfileWithFile,
    requireAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
