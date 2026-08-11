const express = require('express');
const router = express.Router();

const ChatController = require('../controllers/chatController');
const authController = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');


// ============================================================
// CONVERSATION
// ============================================================

/**
 * @route   POST /api/chat/conversation
 * @desc    Initialiser ou récupérer une conversation avec un contact
 * @access  Privé
 */ 
router.post(
    '/conversation',
    auth,
    ChatController.initializeConversation
);


// ============================================================
// HISTORIQUE D'UNE CONVERSATION
// ============================================================

/**
 * @route   GET /api/chat/history/:conversationId
 * @desc    Récupérer et déchiffrer l'historique des messages
 * @access  Privé
 */
router.get(
    '/history/:conversationId',
    auth,
    ChatController.getChatHistory
);


// ============================================================
// RECHERCHE D'UTILISATEUR
// ============================================================

/**
 * @route   GET /api/chat/search
 * @desc    Rechercher un utilisateur par son nom
 * @access  Privé
 */
router.get(
    '/search',
    auth,
    authController.findByName
);


// ============================================================
// MESSAGES GLOBAUX
// ============================================================

/**
 * @route   GET /api/chat/all-messages
 * @desc    Récupérer tous les messages avec le nom de leur expéditeur
 * @access  Privé
 */
router.get(
    '/all-messages',
    auth,
    ChatController.getAllMessages
);


module.exports = router;
