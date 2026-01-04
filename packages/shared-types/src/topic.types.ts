import type { PublicUserProfile } from './user.types';

export const TOPIC_CATEGORIES = [
  'Education',
  'Tourism',
  'Business',
  'Culture',
  'Sports',
  'Entertainment',
] as const;

export type Category = (typeof TOPIC_CATEGORIES)[number];

export interface Topic {
  _id: string;
  title: string;
  content: string;
  category: Category;
  images: string[];
  author: PublicUserProfile;
  likesCount: number;
  commentsCount: number;
  isLikedByUser: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTopicRequest {
  title: string;
  content: string;
  category: Category;
}

export interface UpdateTopicRequest {
  title?: string;
  content?: string;
  category?: Category;
  // images?: string[]; // sadece URL ile update yapacaksan aç
}

export type TopicSort = 'newest';

export interface TopicFilters {
  category?: Category;
  authorId?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: TopicSort;
}

export interface TopicsResponse {
  topics: Topic[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalTopics: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface LikeResponse {
  message: string;
  likesCount: number;
}
