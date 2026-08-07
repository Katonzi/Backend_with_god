// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationsController');
const authMiddleware = require('../middlewares/authMiddleware'); // Ton middleware JWT

// Récupérer mes notifications
router.get('/', authMiddleware, NotificationController.getMyNotifications);

// Tout marquer comme lu (à placer avant /:id/read pour éviter les conflits d'URL)
router.patch('/read-all', authMiddleware, NotificationController.markAllAsRead);

// Marquer une notification spécifique comme lue
router.patch('/:id/read', authMiddleware, NotificationController.markAsRead);

module.exports = router;