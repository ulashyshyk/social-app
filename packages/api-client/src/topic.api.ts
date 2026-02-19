import { Topic, CreateTopicRequest, UpdateTopicRequest, TopicFilters, TopicsResponse } from '../../shared-types/src/topic.types';
import apiClient from './http';

export const topicApi = {
    // Get all topics with filters
    getAll: async (filters?: TopicFilters): Promise<TopicsResponse> => {
        const params = new URLSearchParams();
        
        if (filters?.category) params.append('category', filters.category);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());
        const query = params.toString();
        const url = query ? `/topics?${query}` : '/topics';

        const response = await apiClient.get<TopicsResponse>(url);
        return response.data;
    },

    // Get single topic by ID
    getById: async (id: string): Promise<Topic> => {
        const response = await apiClient.get<Topic>(`/topics/${id}`);
        return response.data;
    },

    // Create topic with images (multipart/form-data)
    create: async (data: CreateTopicRequest, images?: File[]): Promise<Topic> => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', data.content);
        formData.append('category', data.category);

        // Add images
        if (images && images.length > 0) {
            images.forEach(image => {
                formData.append('images', image);
        });
        }

        const response = await apiClient.post<Topic>('/topics', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    },

    // Update topic
    update: async (id: string, data: UpdateTopicRequest, images?: File[]): Promise<Topic> => {
        const formData = new FormData();
        
        if (data.title) formData.append('title', data.title);
        if (data.content) formData.append('content', data.content);
        if (data.category) formData.append('category', data.category);

        // Add new images
        if (images && images.length > 0) {
            images.forEach(image => {
                formData.append('images', image);
            });
        }

        const response = await apiClient.put<Topic>(`/topics/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    },

    // Delete topic
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/topics/${id}`);
    },

    // Like topic
    like: async (id: string): Promise<{ message: string; likesCount: number }> => {
        const response = await apiClient.post(`/topics/${id}/like`);
        return response.data;
    },

    // Unlike topic
    unlike: async (id: string): Promise<{ message: string; likesCount: number }> => {
        const response = await apiClient.delete(`/topics/${id}/like`);
        return response.data;
    }
};
  