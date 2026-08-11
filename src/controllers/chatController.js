const ChatModel = require('../models/chatModel');
const { encryptMessage, decryptMessage } = require('../utils/encryptionHelper');

const ChatController = {

    // 🆕 Initialiser ou récupérer une conversation entre deux utilisateurs
    initializeConversation: async (req, res) => {
        try {
            // L'utilisateur connecté
            const userOneId = req.user.id;

            // Utilisateur avec lequel on souhaite discuter
            const { receiverId } = req.body;

            if (!receiverId) {
                return res.status(400).json({
                    success: false,
                    message: "L'identifiant du destinataire (receiverId) est requis."
                });
            }

            // Récupérer ou créer la conversation
            const conversationId = await ChatModel.getOrCreateConversation(
                userOneId,
                receiverId
            );

            return res.status(200).json({
                success: true,
                conversationId: conversationId
            });

        } catch (error) {
            console.error("Erreur initializeConversation:", error);

            return res.status(500).json({
                success: false,
                message: "Erreur serveur lors de la création de la conversation."
            });
        }
    },


    // 💬 Sauvegarder un nouveau message
    // Le message est chiffré avant d'être enregistré.
    storeNewMessage: async (conversationId, senderId, plainText) => {
        try {

            // 1. Chiffrer le message
            const { encryptedData, iv } = encryptMessage(plainText);

            // 2. Sauvegarder le message chiffré en base
            const messageId = await ChatModel.saveMessage(
                conversationId,
                senderId,
                encryptedData,
                iv
            );

            // 3. Récupérer le message fraîchement créé
            //    avec les informations de son expéditeur.
            const message = await ChatModel.getMessageById(messageId);

            if (!message) {
                return {
                    success: false,
                    error: "Le message a été enregistré mais impossible de le récupérer."
                };
            }

            // 4. Déchiffrer le message pour pouvoir le transmettre
            //    au serveur Socket.io.
            const decryptedMessage = {
                id: message.id,
                conversation_id: message.conversation_id,
                sender_id: message.sender_id,
                sender_name: message.sender_name,
                text: decryptMessage(
                    message.message_text,
                    message.iv
                ),
                is_read: message.is_read,
                created_at: message.created_at
            };

            return {
                success: true,
                messageId: messageId,
                message: decryptedMessage
            };

        } catch (error) {
            console.error("Erreur storeNewMessage:", error);

            return {
                success: false,
                error: error.message
            };
        }
    },


    // 📜 Récupérer l'historique complet d'une discussion
    // avec déchiffrement des messages.
    getChatHistory: async (req, res) => {
        try {

            const { conversationId } = req.params;

            // Récupérer les messages chiffrés
            const rawMessages =
                await ChatModel.getMessagesByConversation(conversationId);

            // Déchiffrer chaque message
            const decryptedMessages = rawMessages.map(msg => ({
                id: msg.id,
                conversation_id: msg.conversation_id,
                sender_id: msg.sender_id,
                sender_name: msg.sender_name,
                text: decryptMessage(
                    msg.message_text,
                    msg.iv
                ),
                is_read: msg.is_read,
                created_at: msg.created_at
            }));

            return res.status(200).json({
                success: true,
                data: decryptedMessages
            });

        } catch (error) {

            console.error("Erreur getChatHistory:", error);

            return res.status(500).json({
                success: false,
                message: "Erreur serveur lors de la récupération du chat."
            });
        }
    },


    // 🌍 Récupérer tous les messages
    getAllMessages: async (req, res) => {
        try {

            // Récupérer tous les messages depuis le Model
            const resultat = await ChatModel.getAllMessages();

            // Déchiffrer les messages
            const decryptedMessages = resultat.map(msg => ({
                id: msg.id,
                conversation_id: msg.conversation_id,
                sender_id: msg.sender_id,
                sender_name: msg.sender_name,
                text: decryptMessage(
                    msg.message_text,
                    msg.iv
                ),
                is_read: msg.is_read,
                created_at: msg.created_at
            }));

            return res.status(200).json({
                success: true,
                data: decryptedMessages
            });

        } catch (error) {

            console.error("Erreur getAllMessages:", error);

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    getConversationUsers: async (conversationId) => {
    try {
        return await ChatModel.getConversationUsers(conversationId);
    } catch (error) {
        console.error(
            "Erreur getConversationUsers:",
            error
        );

        return [];
    }
},

};

module.exports = ChatController;
