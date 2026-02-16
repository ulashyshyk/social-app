import type { PublicUserProfile } from "./user.types";

// Notification types
export const NOTIFICATION_TYPES = [
    'topic_like',
    'topic_comment',
    'comment_like',
    'friend_request',
    'friend_accept',
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

// Entity types
export const ENTITY_TYPES = ['topic', 'comment', 'user'] as const;

export type EntityType = (typeof ENTITY_TYPES)[number];

// Notification object will be shown in frontend
export interface Notification {
    _id: string;
    recipient: string;
    actor: PublicUserProfile;
    type: NotificationType;
    entityType: EntityType;
    entityId: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}

// Will be used when notification created in backend
export interface CreateNotificationDTO {
    actorId: string;
    recipientId: string;
    type: NotificationType;
    entityType: EntityType;
    entityId: string;
}

// API responses
export interface NotificationsResponse {
  notifications: Notification[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalNotifications: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface UnreadCountResponse {
  count: number;
}

export interface MarkAsReadResponse {
  success: boolean;
  modifiedCount?: number;
}

// Query parameters
export interface NotificationFilters {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}

// Socket.IO event payloads
export interface NotificationNewEvent {
  notification: Notification;
}

export interface NotificationReadEvent {
  notificationId: string;
}

export interface NotificationDeleteEvent {
  notificationId: string;
}