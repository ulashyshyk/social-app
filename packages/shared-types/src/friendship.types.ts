export type FriendshipStatus = 
  | 'none' 
  | 'request_sent' 
  | 'request_received' 
  | 'friends';

export interface FriendRequest {
  id: string;
  requesterId: string;
  recipientId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface Friendship {
  userId: string;
  friendId: string;
  createdAt: Date;
}

export interface FriendRequestWithUser extends FriendRequest {
  requester: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
}

export interface FriendshipState {
  friends: string[]; 
  sentRequests: FriendRequest[];
  receivedRequests: FriendRequest[];
  friendshipStatusCache: Record<string, FriendshipStatus>;
}
