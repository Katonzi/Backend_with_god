const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/commentController');
const verifyToken = require('../middlewares/authMiddleware'); // À adapter selon ton vrai nom de fichier

// Ajouter un commentaire sur une prière spécifique
router.post('/post/:prayerId', verifyToken, CommentController.createComment);

// Récupérer tous les commentaires d'une prière
router.get('/get/:prayerId', verifyToken, CommentController.getComments);

module.exports = router;