const CommentModel = require('../models/commentModel');

const CommentService = {
    addComment: async (prayerId, userId, text) => {
        if (!text || !text.trim()) {
            throw new Error("Le contenu du commentaire ne peut pas être vide.");
        }
        if (!prayerId) {
            throw new Error("L'identifiant de la publication est manquant.");
        }
        
        const commentId = await CommentModel.create(prayerId, userId, text.trim());
        return { success: true, commentId, message: "Commentaire ajouté avec succès." };
    },

    getPrayerComments: async (prayerId) => {
        if (!prayerId) {
            throw new Error("L'identifiant de la publication est requis.");
        }
        return await CommentModel.getByPrayerId(prayerId);
    }
};

module.exports = CommentService;    