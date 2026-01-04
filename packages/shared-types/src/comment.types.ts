import type { PublicUserProfile } from './user.types';

export interface Comment {
    _id: string;
    content: string;
    topicId: string;
    author: PublicUserProfile;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCommentRequest {
  topicId: string;
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}

export type CommentSort = 'newest';

export interface CommentFilters {
  topicId: string;
  page?: number;
  limit?: number;
  sort?: CommentSort;
}

export interface CommentsResponse {
  comments: Comment[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalComments: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}