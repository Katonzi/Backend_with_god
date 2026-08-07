const db = require('../config/db');

const ChatModel = {
    // Trouver ou créer une conversation privée unique entre deux utilisateurs
    getOrCreateConversation: async (userOneId, userTwoId) => {
        // Pour éviter les inversions (ex: 1 et 2 vs 2 et 1), on trie les IDs
        const p1 = Math.min(userOneId, userTwoId);
        const p2 = Math.max(userOneId, userTwoId);

        // 1. Vérifier si la conversation existe déjà
        const [existing] = await db.query(
            'SELECT id FROM conversations WHERE user_one_id = ? AND user_two_id = ?',
            [p1, p2]
        );

        if (existing.length > 0) {
            return existing[0].id;
        }

        // 2. Si elle n'existe pas, on la crée 
        const [result] = await db.query(
            'INSERT INTO conversations (user_one_id, user_two_id) VALUES (?, ?)',
            [p1, p2]
        );
        return result.insertId;
    },

    // Enregistrer un message brut chiffré dans la base de données
    saveMessage: async (conversationId, senderId, encryptedText, iv) => {
        const [result] = await db.query(
            'INSERT INTO messages (conversation_id, sender_id, message_text, iv) VALUES (?, ?, ?, ?)',
            [conversationId, senderId, encryptedText, iv]
        );
        return result.insertId;
    },

    // Récupérer tous les messages bruts d'une conversation précise
    getMessagesByConversation: async (conversationId) => {
        const [rows] = await db.query(
            `SELECT 
                m.id, 
                m.conversation_id, 
                m.sender_id, 
                m.message_text, 
                m.iv, 
                m.is_read, 
                m.created_at, 
                u.username as sender_name 
             FROM messages m
             JOIN users u ON m.sender_id = u.id
             WHERE m.conversation_id = ? 
             ORDER BY m.created_at ASC`,
            [conversationId]
        );
        return rows;
    },

     getAllMessages : async()=>{
        const [query] = await db.query(`SELECT * FROM messages`);

        return query;
    }
};

module.exports = ChatModel;