const db = require('../config/db');

const Prayer = {
    // 1. Récupérer toutes les prières avec compteurs et noms de ceux qui aiment
    getFeed: async () => {
        const query = `
            SELECT 
                p.id, 
                p.description,
                p.created_at,
                u_author.username AS username,
                (SELECT COUNT(*) FROM prayer_supports WHERE prayer_id = p.id) AS supports_count,
                (SELECT GROUP_CONCAT(u_supporter.username SEPARATOR ', ') 
                 FROM prayer_supports ps
                 JOIN users u_supporter ON ps.user_id = u_supporter.id
                 WHERE ps.prayer_id = p.id
                ) AS supporter_names
            FROM prayers p
            JOIN users u_author ON p.user_id = u_author.id
            ORDER BY p.created_at DESC
        `;
        const [rows] = await db.execute(query);
        return rows;
    },

    // 2. Vérifier si un utilisateur soutient déjà une prière spécifique
    checkSupport: async (userId, prayerId) => {
        const query = 'SELECT * FROM prayer_supports WHERE user_id = ? AND prayer_id = ?';
        const [rows] = await db.execute(query, [userId, prayerId]);
        return rows.length > 0;
    },

    // 3. Ajouter un soutien (Incrémenter)
    addSupport: async (userId, prayerId) => {
        const query = 'INSERT INTO prayer_supports (user_id, prayer_id) VALUES (?, ?)';
        return await db.execute(query, [userId, prayerId]);
    },

    // 4. Retirer un soutien (Décrémenter)
    removeSupport: async (userId, prayerId) => {
        const query = 'DELETE FROM prayer_supports WHERE user_id = ? AND prayer_id = ?';
        return await db.execute(query, [userId, prayerId]);
    }, 

};

module.exports = Prayer;