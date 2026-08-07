// Importe ta connexion ou ton pool MySQL habituel
const db = require('../config/db');     

class BibleModel {
    
    // 1. Chercher le numéro du chapitre maximum pour un livre donné
    async getMaxChapter(bookId) {
        const query = 'SELECT MAX(chapter) as totalChapters FROM bible_verses_segond_1910 WHERE book = ?';
        const [rows] = await db.execute(query, [bookId]);
        return rows[0].totalChapters;
    }

    // 2. Extraire tous les versets d'un chapitre spécifique
    async getVersesByChapter(bookId, chapterId) {
        const query = 'SELECT id, verse, text FROM bible_verses_segond_1910 WHERE book = ? AND chapter = ? ORDER BY verse ASC';
        const [rows] = await db.execute(query, [bookId, chapterId]);
        return rows;
    }

//Filtrer le résultats de la rechecche d'un versets.
async searchVersesByKeyword(keyword) {
    const searchPattern = `%${keyword}%`;
    const query = `
        SELECT id, book, chapter, verse, text     
        FROM bible_verses_segond_1910 
        WHERE text LIKE ? 
        LIMIT 50 
    `;
    const [rows] = await db.execute(query, [searchPattern]);
    return rows;
}
}

module.exports = new BibleModel();