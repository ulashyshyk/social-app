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
  /**
   * Notification oluştur
   * - Self-notification kontrolü yapar
   * - Duplicate notification oluşturmaz (unique index sayesinde)
   * - Actor bilgisini populate eder
   */
  async create(params: CreateNotificationDTO) {
    const { actorId, recipientId, type, entityType, entityId } = params;

    // 1. Self-notification kontrolü
    if (actorId === recipientId) {
      console.log('Self-notification prevented:', { actorId, entityId, type });
      return null;
    }

    try {
      // 2. Notification oluştur
      const notification = await Notification.create({
        actor: actorId,
        recipient: recipientId,
        type,
        entityType,
        entityId,
        isRead: false,
      });

      // 3. Actor bilgisini populate et (Frontend'de "John liked your post" göstermek için)
      await notification.populate('actor', 'username profilePicture');

      console.log('Notification created:', {
        id: notification._id,
        type,
        from: actorId,
        to: recipientId,
      });

      return notification;
    } catch (error: any) {
      // Duplicate key error (MongoDB error code: 11000)
      // Aynı actor, aynı entity için zaten notification varsa
      if (error.code === 11000) {
        console.log('Duplicate notification prevented:', { actorId, recipientId, entityId, type });
        return null;
      }
      
      // Başka bir hata varsa fırlat
      console.error('Notification creation error:', error);
      throw error;
    }
  }

  /**
   * Notification sil
   * - Unlike, uncomment gibi durumlarda kullanılır
   * - Sadece actor ve entity bilgisi yeterli
   */
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

  /**
   * Kullanıcının notification'larını getir (paginated)
   * - En yeni notification'lar önce gelir
   * - Actor bilgisi populate edilir
   */
  async getByUserId(
    userId: string | Types.ObjectId, 
    options: PaginationOptions = {}
  ) {
    const { page = 1, limit = 20, unreadOnly = false } = options;
    const skip = (page - 1) * limit;

    // Query oluştur
    const query: any = { recipient: userId };
    if (unreadOnly) {
      query.isRead = false;
    }

    // Notification'ları çek
    const notifications = await Notification.find(query)
      .populate('actor', 'username profilePicture')
      .sort({ createdAt: -1 })  // En yeni önce
      .skip(skip)
      .limit(limit)
      .lean();  // Plain JavaScript object olarak döner (daha performanslı)

    // Total count (pagination için)
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

  /**
   * Okunmamış notification sayısı
   * - Badge'de gösterilecek
   */
  async getUnreadCount(userId: string | Types.ObjectId): Promise<number> {
    return await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });
  }

  /**
   * Tek bir notification'ı okundu olarak işaretle
   * - Kullanıcı sadece kendi notification'ını mark edebilir (güvenlik)
   */
  async markAsRead(
    notificationId: string | Types.ObjectId, 
    userId: string | Types.ObjectId
  ): Promise<boolean> {
    const result = await Notification.updateOne(
      { _id: notificationId, recipient: userId },  // recipient kontrolü önemli!
      { isRead: true }
    );

    return result.modifiedCount > 0;
  }

  /**
   * Tüm notification'ları okundu olarak işaretle
   * - "Mark all as read" butonu için
   */
  async markAllAsRead(userId: string | Types.ObjectId): Promise<number> {
    const result = await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );

    console.log(`Marked ${result.modifiedCount} notifications as read for user ${userId}`);
    
    return result.modifiedCount;
  }

  /**
   * Notification sil (kullanıcı manuel olarak silerse)
   * - Kullanıcı sadece kendi notification'ını silebilir
   */
  async deleteById(
    notificationId: string | Types.ObjectId, 
    userId: string | Types.ObjectId
  ): Promise<boolean> {
    const result = await Notification.deleteOne({
      _id: notificationId,
      recipient: userId,  // recipient kontrolü önemli!
    });

    return result.deletedCount > 0;
  }

  /**
   * Belirli bir entity ile ilgili tüm notification'ları sil
   * - Topic silinirse o topic ile ilgili tüm notification'lar silinmeli
   * - Comment silinirse o comment ile ilgili tüm notification'lar silinmeli
   */
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
