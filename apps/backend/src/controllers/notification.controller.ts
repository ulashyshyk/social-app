import { Request, Response } from 'express';
import notificationService from '../services/notification.service';

class NotificationController {
  /**
   * GET /api/notifications
   * Kullanıcının notification'larını getir (paginated)
   */
  async getNotifications(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized' 
        });
      }

      // Query params'ları parse et
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const unreadOnly = req.query.unreadOnly === 'true';

      // Service'den notification'ları getir
      const result = await notificationService.getByUserId(userId, {
        page,
        limit,
        unreadOnly,
      });

      return res.status(200).json({
        success: true,
        data: result.notifications,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error('Get notifications error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Server error' 
      });
    }
  }

  /**
   * GET /api/notifications/unread-count
   * Okunmamış notification sayısı (badge için)
   */
  async getUnreadCount(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized' 
        });
      }

      const count = await notificationService.getUnreadCount(userId);

      return res.status(200).json({
        success: true,
        count,
      });
    } catch (error) {
      console.error('Get unread count error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Server error' 
      });
    }
  }

  /**
   * PATCH /api/notifications/:id/read
   * Tek bir notification'ı okundu olarak işaretle
   */
  async markAsRead(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized' 
        });
      }

      if (!id) {
        return res.status(400).json({ 
          success: false, 
          message: 'Notification ID is required' 
        });
      }

      const success = await notificationService.markAsRead(id, userId);

      if (!success) {
        return res.status(404).json({ 
          success: false, 
          message: 'Notification not found or already read' 
        });
      }

      return res.status(200).json({ 
        success: true,
        message: 'Notification marked as read' 
      });
    } catch (error) {
      console.error('Mark as read error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Server error' 
      });
    }
  }

  /**
   * PATCH /api/notifications/read-all
   * Tüm notification'ları okundu olarak işaretle
   */
  async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized' 
        });
      }

      const modifiedCount = await notificationService.markAllAsRead(userId);

      return res.status(200).json({
        success: true,
        message: `${modifiedCount} notifications marked as read`,
        modifiedCount,
      });
    } catch (error) {
      console.error('Mark all as read error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Server error' 
      });
    }
  }

  /**
   * DELETE /api/notifications/:id
   * Notification sil
   */
  async deleteNotification(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized' 
        });
      }

      if (!id) {
        return res.status(400).json({ 
          success: false, 
          message: 'Notification ID is required' 
        });
      }

      const success = await notificationService.deleteById(id, userId);

      if (!success) {
        return res.status(404).json({ 
          success: false, 
          message: 'Notification not found' 
        });
      }

      return res.status(200).json({ 
        success: true,
        message: 'Notification deleted' 
      });
    } catch (error) {
      console.error('Delete notification error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Server error' 
      });
    }
  }
}

export default new NotificationController();
