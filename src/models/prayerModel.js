const db = require('../config/db');

const Prayer = {
    // Créer une intention
    create: async (userId, description, isAnonymous) => {
        const [result] = await db.execute(
            'INSERT INTO prayers (user_id, description, is_anonymous) VALUES (?, ?, ?)',
            [userId, description, isAnonymous]
        );
        return result.insertId;
    },
    countByUserId: async (userId) => {
        const query = 'SELECT COUNT(*) AS total FROM prayers WHERE user_id = ?';
        const [rows] = await db.execute(query, [userId]);
        return rows[0].total;
    }, 

    findByUserId: async (userId) => {
        const query = 'SELECT * FROM prayers WHERE user_id = ? ORDER BY created_at DESC';
        const [rows] = await db.execute(query, [userId]);
        return rows;
    },
    // Récupérer toutes les prières (les plus récentes en premier)
    getAll: async () => {   
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
ORDER BY p.created_at DESC;
        `;
        const [rows] = await db.execute(query);
        return rows;
    },

    removePrayers: async (idPrayers)=>{
        const sql = `DELETE FROM prayers WHERE id = ?`;
        const [rows] = await db.query(sql, [idPrayers]);
        return rows;
    },
    updatePrayers: async (idPrayers, description)=>{
        const query = `UPDATE prayers SET description = ? WHERE id = ?`;
        const [rows] = await db.query(query, [description, idPrayers]);

        return rows; 
    }
};

module.exports = Prayer;