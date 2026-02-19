import { Comment } from '../../shared-types/src/comment.types';
import apiClient from './http';

export interface CommentWithReplies extends Comment {
  replies: Comment[];          
  totalRepliesCount: number; 
  hasMoreReplies: boolean;     
  isLikedByCurrentUser?: boolean;  
}

export interface CreateReplyRequest {
  content: string;
}

export interface CreateReplyResponse extends Comment {
  parentUsername?: string;   
}

export const commentApi = {
  getByTopicId: async (topicId: string): Promise<CommentWithReplies[]> => {
    const response = await apiClient.get<CommentWithReplies[]>(`/comments/${topicId}`);
    return response.data;
  },

  create: async (topicId: string, content: string): Promise<Comment> => {
    const response = await apiClient.post<Comment>(`/comments/${topicId}`, {
      content,
    });
    return response.data;
  },

  update: async (commentId: string, content: string): Promise<Comment> => {
    const response = await apiClient.put<Comment>(`/comments/${commentId}`, {
      content,
    });
    return response.data;
  },

  delete: async (commentId: string): Promise<void> => {
    await apiClient.delete(`/comments/${commentId}`);
  },

  createReply: async (parentCommentId: string, content: string): Promise<CreateReplyResponse> => {
    const response = await apiClient.post<CreateReplyResponse>(
      `/comments/${parentCommentId}/replies`,
      { content }
    );
    return response.data;
  },

  like: async (commentId: string): Promise<Comment> => {
    const response = await apiClient.post<Comment>(`/comments/${commentId}/like`);
    return response.data;
  },

  unlike: async (commentId: string): Promise<Comment> => {
    const response = await apiClient.delete<Comment>(`/comments/${commentId}/like`);
    return response.data;
  },
};
