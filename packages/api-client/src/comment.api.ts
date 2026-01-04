// packages/api-client/src/comment.api.ts

import { Comment } from '../../shared-types/src/comment.types';
import apiClient from './http';

export const commentApi = {
  getByTopicId: async (topicId: string): Promise<Comment[]> => {
    const response = await apiClient.get<Comment[]>(`/comments/topic/${topicId}`);
    return response.data;
  },

  create: async (topicId: string, content: string): Promise<Comment> => {
    const response = await apiClient.post<Comment>(`/comments/topic/${topicId}`, {
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
};
