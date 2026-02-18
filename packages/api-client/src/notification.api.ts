import type { 
  Notification,
  NotificationsResponse,
  UnreadCountResponse,
  MarkAsReadResponse,
  NotificationFilters 
} from '../../shared-types/src/notification.types';

import apiClient from './http';

export const notificationApi = {
  // Get all notifications with filters
  getAll: async (filters?: NotificationFilters): Promise<NotificationsResponse> => {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.unreadOnly) params.append('unreadOnly', 'true');

    const query = params.toString();
    const url = query ? `/notifications?${query}` : '/notifications';
    
    const response = await apiClient.get<NotificationsResponse>(url);
    return response.data;
  },

  // Get unread notification count (for badge)
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    const response = await apiClient.get<UnreadCountResponse>('/notifications/unread-count');
    return response.data;
  },

  // Mark single notification as read
  markAsRead: async (id: string): Promise<MarkAsReadResponse> => {
    const response = await apiClient.patch<MarkAsReadResponse>(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<MarkAsReadResponse> => {
    const response = await apiClient.patch<MarkAsReadResponse>('/notifications/read-all');
    return response.data;
  },

  // Delete notification
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/notifications/${id}`);
  },
};
