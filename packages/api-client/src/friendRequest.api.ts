import apiClient from './http';
import type { 
  FriendRequest, 
  FriendRequestWithUser, 
  FriendshipStatus 
} from '../../shared-types/src/friendship.types';
import type { PublicUserProfile } from '../../shared-types/src/user.types';

export const friendRequestApi = {
  // Send friend request
  sendFriendRequest: async (recipientId: string): Promise<FriendRequest> => {
    try {
      const { data } = await apiClient.post<FriendRequest>('/friend-requests', { recipientId });
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send friend request');
    }
  },

  // Get received requests
  getReceivedRequests: async (params?: { status?: 'pending' | 'accepted' | 'rejected' }): Promise<FriendRequestWithUser[]> => {
    try {
      const { data } = await apiClient.get<FriendRequestWithUser[]>('/friend-requests/received', { params });
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch received requests');
    }
  },

  // Get sent requests
  getSentRequests: async (params?: { status?: 'pending' | 'accepted' | 'rejected' }): Promise<FriendRequestWithUser[]> => {
    try {
      const { data } = await apiClient.get<FriendRequestWithUser[]>('/friend-requests/sent', { params });
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch sent requests');
    }
  },

  // Accept friend request
  acceptFriendRequest: async (requestId: string): Promise<{ message: string; friendRequest: FriendRequest }> => {
    try {
      const { data } = await apiClient.patch(`/friend-requests/${requestId}/accept`);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to accept friend request');
    }
  },

  // Reject friend request
  rejectFriendRequest: async (requestId: string): Promise<{ message: string }> => {
    try {
      const { data } = await apiClient.patch(`/friend-requests/${requestId}/reject`);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reject friend request');
    }
  },

  // Cancel sent request
  cancelFriendRequest: async (requestId: string): Promise<{ message: string }> => {
    try {
      const { data } = await apiClient.delete(`/friend-requests/${requestId}`);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to cancel friend request');
    }
  },

  // Get friendship status
  getFriendshipStatus: async (userId: string): Promise<{ status: FriendshipStatus; requestId?: string }> => {
    try {
      const { data } = await apiClient.get(`/friend-requests/status/${userId}`);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get friendship status');
    }
  },

  // Get friends list
  getFriends: async (): Promise<PublicUserProfile[]> => {
    try {
      const { data } = await apiClient.get<PublicUserProfile[]>('/friend-requests/friends');
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch friends');
    }
  },
};
