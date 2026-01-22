import apiClient from './http';
import { AuthenticatedUser, PublicUserProfile, UpdateProfileRequest } from '../../shared-types/src/user.types';

export const userApi = {
  
  getMe: async (): Promise<AuthenticatedUser> => {
    const { data } = await apiClient.get<AuthenticatedUser>('/users/me');
    return data;
  },

  updateMe: async (updateData: UpdateProfileRequest): Promise<AuthenticatedUser> => {
    const { data } = await apiClient.patch<AuthenticatedUser>('/users/me', updateData);
    return data;
  },

  updateMeWithFile: async (formData: FormData): Promise<AuthenticatedUser> => {
    const { data } = await apiClient.patch<AuthenticatedUser>('/users/me', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  getUserById: async (id: string): Promise<PublicUserProfile> => {
    const { data } = await apiClient.get<PublicUserProfile>(`/users/${id}`);
    return data;
  },

  getUserByUsername: async (username: string): Promise<PublicUserProfile> => {
    const { data } = await apiClient.get(`/users/username/${username}`);
    return data;
  },
};
