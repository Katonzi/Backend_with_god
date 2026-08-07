const db = require('../config/db'); 
const CommentModel = {
    // Insérer le commentaire
    create: async (prayerId, userId, text) => {
        const sql = `INSERT INTO comments (prayer_id, user_id, comment_text) VALUES (?, ?, ?)`;
        const [result] = await db.query(sql, [prayerId, userId, text]);
        return result.insertId;
    },

    // Récupérer les commentaires d'une prière avec les infos de l'auteur
    getByPrayerId: async (prayerId) => {
        const sql = `
            SELECT 
                c.id,
                c.prayer_id,
                c.user_id,
                c.comment_text,
                c.created_at,
                u.username
            FROM comments c
            INNER JOIN users u ON c.user_id = u.id 
            WHERE c.prayer_id = ?
            ORDER BY c.created_at DESC  
        `;
        const [rows] = await db.query(sql, [prayerId]);
        return rows;
    }
};

module.exports = CommentModel;