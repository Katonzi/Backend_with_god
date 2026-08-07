const db = require('../config/db');

const Intercession = {
    add: async (prayerId, userId) => {
    
        const [existing] = await db.execute(
            'SELECT * FROM intercessions WHERE prayer_id = ? AND user_id = ?',
            [prayerId, userId]
        );

        if (existing.length > 0) return null;

        const [result] = await db.execute(
            'INSERT INTO intercessions (prayer_id, user_id) VALUES (?, ?)',
            [prayerId, userId]
        );
        return result.insertId;
    },

    // Compter les soutiens pour une prière spécifique
    getCountByPrayer: async (prayerId) => {
        const [rows] = await db.execute(
            'SELECT COUNT(*) as total FROM intercessions WHERE prayer_id = ?',
            [prayerId]
        );
        
        return rows[0].total
    }
};
  
module.exports = Intercession; 