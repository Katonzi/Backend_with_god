const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chatController');
const authController = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');

/**
 * @route   POST /api/chat/conversation
 * @desc    Initialiser ou récupérer une conversation avec un contact
 * @access  Privé
 */
router.post('/conversation', auth, ChatController.initializeConversation);

/**
 * @route   GET /api/chat/history/:conversationId
 * @desc    Récupérer et déchiffrer l'historique des messages
 * @access  Privé
 */
router.get('/history/:conversationId', auth, ChatController.getChatHistory);

/**
 * @route   GET /api/chat/search
 * @desc    Rechercher un utilisateur (via authController)
 */
router.get('/search', auth, authController.findByName);
router.get('/all-messages',auth, ChatController.getAllMessages);

module.exports = router;