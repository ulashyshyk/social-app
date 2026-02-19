"use client";

import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import  {friendRequestApi}  from "../../../packages/api-client/src/friendRequest.api";
import type {
  FriendRequestWithUser,
  FriendshipStatus,
} from "../../../packages/shared-types/src/friendship.types";
import type { PublicUserProfile } from "../../../packages/shared-types/src/user.types";
import { AuthContext } from "./AuthContext";

interface FriendshipContextType {
  friends: PublicUserProfile[];
  receivedRequests: FriendRequestWithUser[];
  sentRequests: FriendRequestWithUser[];
  friendshipStatusCache: Record<string, FriendshipStatus>;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchFriends: () => Promise<void>;
  fetchReceivedRequests: () => Promise<void>;
  fetchSentRequests: () => Promise<void>;
  sendFriendRequest: (recipientId: string) => Promise<void>;
  acceptRequest: (requestId: string, requesterId: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
  cancelRequest: (requestId: string) => Promise<void>;
  getFriendshipStatus: (userId: string) => Promise<FriendshipStatus>;
  clearError: () => void;
}

export const FriendshipContext = createContext<FriendshipContextType | undefined>(
  undefined
);

export function FriendshipProvider({ children }: { children: ReactNode }) {
  const authContext = useContext(AuthContext);
  const [friends, setFriends] = useState<PublicUserProfile[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<FriendRequestWithUser[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequestWithUser[]>([]);
  const [friendshipStatusCache, setFriendshipStatusCache] = useState<Record<string, FriendshipStatus>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fetch data when user logs in
  useEffect(() => {
    if (authContext?.isAuthenticated) {
      fetchFriends();
      fetchReceivedRequests();
      fetchSentRequests();
    } else {
      // Clear data when user logs out
      setFriends([]);
      setReceivedRequests([]);
      setSentRequests([]);
      setFriendshipStatusCache({});
    }
  }, [authContext?.isAuthenticated]);

  const fetchFriends = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const friendsList = await friendRequestApi.getFriends();
      setFriends(friendsList);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReceivedRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const requests = await friendRequestApi.getReceivedRequests({ status: 'pending' });
      setReceivedRequests(requests);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSentRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const requests = await friendRequestApi.getSentRequests({ status: 'pending' });
      setSentRequests(requests);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const sendFriendRequest = async (recipientId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await friendRequestApi.sendFriendRequest(recipientId);
      
      // Optimistic update
      setFriendshipStatusCache(prev => ({
        ...prev,
        [recipientId]: 'request_sent'
      }));

      // Refresh sent requests
      await fetchSentRequests();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const acceptRequest = async (requestId: string, requesterId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await friendRequestApi.acceptFriendRequest(requestId);

      // Update state
      setReceivedRequests(prev => prev.filter(req => req.id !== requestId));
      setFriendshipStatusCache(prev => ({
        ...prev,
        [requesterId]: 'friends'
      }));

      // Refresh friends list
      await fetchFriends();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const rejectRequest = async (requestId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await friendRequestApi.rejectFriendRequest(requestId);

      // Remove from received requests
      setReceivedRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelRequest = async (requestId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await friendRequestApi.cancelFriendRequest(requestId);

      // Remove from sent requests
      setSentRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getFriendshipStatus = async (userId: string): Promise<FriendshipStatus> => {
    // Check cache first
    if (friendshipStatusCache[userId]) {
      return friendshipStatusCache[userId];
    }

    try {
      const response = await friendRequestApi.getFriendshipStatus(userId);
      
      // Cache the result
      setFriendshipStatusCache(prev => ({
        ...prev,
        [userId]: response.status
      }));

      return response.status;
    } catch (err: any) {
      setError(err.message);
      return 'none';
    }
  };

  const clearError = () => setError(null);

  const value = {
    friends,
    receivedRequests,
    sentRequests,
    friendshipStatusCache,
    isLoading,
    error,
    fetchFriends,
    fetchReceivedRequests,
    fetchSentRequests,
    sendFriendRequest,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    getFriendshipStatus,
    clearError,
  };

  return (
    <FriendshipContext.Provider value={value}>
      {children}
    </FriendshipContext.Provider>
  );
}
