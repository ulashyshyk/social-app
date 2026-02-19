import apiClient from './http';
import type { Topic } from '../../shared-types/src/topic.types';
import type { PublicUserProfile } from '../../shared-types/src/user.types';

export interface SearchAllParams {
  q?: string;
  page?: number;
  limit?: number;
}

export interface SearchAllResponse {
  topics: Topic[];
  users: PublicUserProfile[];
  hasMore: {
    topics: boolean;
    users: boolean;
  };
}

export const searchAll = async (params: SearchAllParams): Promise<SearchAllResponse> => {
  const response = await apiClient.get('/search', { params });
  return response.data;
};

export interface SearchTopicsParams {
  q?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface SearchTopicsResponse {
  topics: Topic[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export const searchTopics = async (params: SearchTopicsParams): Promise<SearchTopicsResponse> => {
  const response = await apiClient.get('/search/topics', { params });
  return response.data;
};

export interface SearchUsersParams {
  q?: string;
  page?: number;
  limit?: number;
}

export interface SearchUsersResponse {
  users: PublicUserProfile[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export const searchUsers = async (params: SearchUsersParams): Promise<SearchUsersResponse> => {
  const response = await apiClient.get('/search/users', { params });
  return response.data;
};
