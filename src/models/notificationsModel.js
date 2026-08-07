// models/NotificationModel.js
const db = require('../config/db'); // Ton pool/connexion MySQL (ex: mysql2/promise)

class NotificationModel {
  // Enregistrer une notification
  static async create({ recipient_id, sender_id, type, title, content, reference_id }) {
    const query = `
      INSERT INTO notifications (recipient_id, sender_id, type, title, content, reference_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      recipient_id,
      sender_id,
      type,
      title,
      content,
      reference_id || null
    ]);
    return result.insertId;
  }

  // Récupérer la notification complète par son ID
  static async findById(id) {
    const query = `
      SELECT n.*, u.username as sender_name, u.avatar as sender_avatar
      FROM notifications n
      JOIN users u ON n.sender_id = u.id
      WHERE n.id = ?
    `;
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  // Récupérer toutes les notifications d'un utilisateur
  static async getByUserId(userId) {
    const query = `
      SELECT n.*, u.username as sender_name, u.avatar as sender_avatar
      FROM notifications n
      JOIN users u ON n.sender_id = u.id
      WHERE n.recipient_id = ?
      ORDER BY n.created_at DESC
      LIMIT 50
    `;
    const [rows] = await db.execute(query, [userId]);
    return rows;
  }

  // Marquer une notification comme lue
  static async markAsRead(notificationId, userId) {
    const query = `
      UPDATE notifications 
      SET is_read = TRUE 
      WHERE id = ? AND recipient_id = ?
    `;
    const [result] = await db.execute(query, [notificationId, userId]);
    return result.affectedRows > 0;
  }

  // Marquer TOUTES les notifications d'un utilisateur comme lues
  static async markAllAsRead(userId) {
    const query = `
      UPDATE notifications 
      SET is_read = TRUE 
      WHERE recipient_id = ? AND is_read = FALSE
    `;
    const [result] = await db.execute(query, [userId]);
    return result.affectedRows;
  }
}

module.exports = NotificationModel;