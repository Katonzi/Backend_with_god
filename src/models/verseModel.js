const db = require('../config/db');

const Verse = {
    // Récupérer le verset programmé pour aujourd'hui
    getTodayVerse: async () => {
        const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
        const [rows] = await db.execute(     
            'SELECT * FROM daily_verses WHERE scheduled_for = ?',
            [today]
        );
        return rows[0]; 
    },

    // Ajouter un nouveau verset (pour l'admin)
    create: async (data) => {
        const { content, reference, scheduled_for, audio_url } = data;
        const [result] = await db.execute(
            'INSERT INTO daily_verses (content, reference, scheduled_for, audio_url) VALUES (?, ?, ?, ?)',
            [content, reference, scheduled_for, audio_url]
        );
        return result.insertId;
    } 
};
 
module.exports = Verse;  