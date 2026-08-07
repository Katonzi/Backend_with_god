// controllers/notificationController.js
const NotificationService = require('../services/notificationsServices');

class NotificationController {
  // GET /api/notifications
  // Récupérer toutes les notifications de l'utilisateur connecté
  static async getMyNotifications(req, res) {
    try {
      const userId = req.user.id; // Injecté par ton middleware d'authentification (JWT)
      const notifications = await NotificationService.getUserNotifications(userId);
      
      return res.status(200).json({
        success: true,
        data: notifications
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur lors de la récupération des notifications."
      });
    }
  }

  // PATCH /api/notifications/:id/read
  // Marquer une notification spécifique comme lue
  static async markAsRead(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const success = await NotificationService.markAsRead(id, userId);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Notification non trouvée ou non autorisée."
        });
      }

      return res.status(200).json({
        success: true,
        message: "Notification marquée comme lue."
      });
    } catch (error) {
      console.error("Erreur lors du changement de statut :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur."
      });
    }
  }

  // PATCH /api/notifications/read-all
  // Marquer toutes les notifications de l'utilisateur comme lues
  static async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;
      await NotificationService.markAllAsRead(userId);

      return res.status(200).json({
        success: true,
        message: "Toutes les notifications ont été marquées comme lues."
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour globale :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur."
      });
    }
  }
}

module.exports = NotificationController;