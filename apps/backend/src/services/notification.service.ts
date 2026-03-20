import Notification from '../models/Notification.model';
import type { 
  NotificationType, 
  EntityType,
  CreateNotificationDTO 
} from '../../../../packages/shared-types/src/notification.types';
import type { Types } from 'mongoose';

interface PaginationOptions {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}

class NotificationService {
  async create(params: CreateNotificationDTO) {
    const { actorId, recipientId, type, entityType, entityId } = params;

    if (actorId === recipientId) {
      console.log('Self-notification prevented:', { actorId, entityId, type });
      return null;
    }

    try {
      const notification = await Notification.create({
        actor: actorId,
        recipient: recipientId,
        type,
        entityType,
        entityId,
        isRead: false,
      });

      await notification.populate('actor', 'username profilePicture');

      console.log('Notification created:', {
        id: notification._id,
        type,
        from: actorId,
        to: recipientId,
      });

      try {
        const io = getIO();
        io.to(recipientId).emit('notification:new', {
          notification,
        });
      } catch (socketError) {
        console.error("Socket emit failed:", socketError);
      }

      return notification;
    } catch (error: any) {
      if (error.code === 11000) {
        console.log('Duplicate notification prevented:', { actorId, recipientId, entityId, type });
        return null;
      }
      
      console.error('Notification creation error:', error);
      throw error;
    }
  }

  async delete(params: {
    actorId: string | Types.ObjectId;
    entityId: string | Types.ObjectId;
    type: NotificationType;
  }) {
    const { actorId, entityId, type } = params;

    const result = await Notification.deleteOne({
      actor: actorId,
      entityId,
      type,
    });

    if (result.deletedCount > 0) {
      console.log('Notification deleted:', { actorId, entityId, type });
    }

    return result.deletedCount > 0;
  }

  async getByUserId(
    userId: string | Types.ObjectId, 
    options: PaginationOptions = {}
  ) {
    const { page = 1, limit = 20, unreadOnly = false } = options;
    const skip = (page - 1) * limit;

    const query: any = { recipient: userId };
    if (unreadOnly) {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .populate('actor', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalCount = await Notification.countDocuments(query);

    return {
      notifications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalNotifications: totalCount,
        limit,
        hasNextPage: page * limit < totalCount,
        hasPrevPage: page > 1,
      },
    };
  }

  async getUnreadCount(userId: string | Types.ObjectId): Promise<number> {
    return await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });
  }

  async markAsRead(
    notificationId: string | Types.ObjectId, 
    userId: string | Types.ObjectId
  ): Promise<boolean> {
    const result = await Notification.updateOne(
      { _id: notificationId, recipient: userId },
      { isRead: true }
    );

    return result.modifiedCount > 0;
  }

  async markAllAsRead(userId: string | Types.ObjectId): Promise<number> {
    const result = await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );

    console.log(`Marked ${result.modifiedCount} notifications as read for user ${userId}`);
    
    return result.modifiedCount;
  }

  async deleteById(
    notificationId: string | Types.ObjectId, 
    userId: string | Types.ObjectId
  ): Promise<boolean> {
    const result = await Notification.deleteOne({
      _id: notificationId,
      recipient: userId,
    });

    return result.deletedCount > 0;
  }

  async deleteByEntity(
    entityId: string | Types.ObjectId, 
    entityType: EntityType
  ): Promise<number> {
    const result = await Notification.deleteMany({
      entityId,
      entityType,
    });

    console.log(`Deleted ${result.deletedCount} notifications for entity ${entityId}`);
    
    return result.deletedCount;
  }
}

export default new NotificationService();
