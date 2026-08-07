// services/notificationService.js
const NotificationModel = require('../models/notificationsModel');

class NotificationService {
  /**
   * Crée et envoie une notification en temps réel
   * @param {Object} data - Données de la notification
   * @param {Object} io - L'instance Socket.io
   */
  static async sendNotification(data, io) {
    const { recipient_id, sender_id, type, title, content, reference_id } = data;

    // 1. Ne pas notifier si l'utilisateur fait une action sur son propre contenu
    if (recipient_id === sender_id) {
      return null;
    }

    // 2. Sauvegarder la notification en BDD MySQL
    const notificationId = await NotificationModel.create({
      recipient_id,
      sender_id,
      type,
      title,
      content,
      reference_id
    });

    // 3. Récupérer les données enrichies (avec infos de l'expéditeur)
    const notification = await NotificationModel.findById(notificationId);

    // 4. Émettre en TEMPS RÉEL via Socket.io dans la room personnelle de l'utilisateur
    if (io) {
      io.to(`user_${recipient_id}`).emit('new_notification', notification);
    }

    return notification;
  }

  static async getUserNotifications(userId) {
    return await NotificationModel.getByUserId(userId);
  }

  static async markAsRead(notificationId, userId) {
    return await NotificationModel.markAsRead(notificationId, userId);
  }

  static async markAllAsRead(userId) {
    return await NotificationModel.markAllAsRead(userId);
  }
}

module.exports = NotificationService;