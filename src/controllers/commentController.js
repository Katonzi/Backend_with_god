const CommentService = require('../services/commentService');

const CommentController = {
    createComment: async (req, res) => {
        try {
            const { prayerId } = req.params; // Récupéré depuis l'URL
            const { comment_text } = req.body; // Récupéré depuis le corps du JSON
            const userId = req.user.id; // Extrait de manière sécurisée depuis le token / middleware

            const result = await CommentService.addComment(prayerId, userId, comment_text);
            return res.status(201).json(result);
        } catch (error) {
            console.error("Erreur Controller Commentaire :", error.message);
            return res.status(400).json({ success: false, message: error.message });
        }
    },

    getComments: async (req, res) => {
        try {
            const { prayerId } = req.params;
            const comments = await CommentService.getPrayerComments(prayerId);
            return res.status(200).json({ success: true, data: comments });
        } catch (error) {
            console.error("Erreur Controller Get Comments :", error.message);
            return res.status(400).json({ success: false, message: error.message });
        }
    }
};

module.exports = CommentController;