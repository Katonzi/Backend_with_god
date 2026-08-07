const ChatModel = require('../models/chatModel');
const { encryptMessage, decryptMessage } = require('../utils/encryptionHelper');

const ChatController = {
    // 🆕 NOUVEAU : Initialiser ou récupérer une conversation entre deux utilisateurs
    initializeConversation: async (req, res) => {
        try {
            // L'utilisateur 1 est celui connecté (injecté par ton middleware d'authentification, ex: req.user.id)
            const userOneId = req.user.id; 
            // L'utilisateur 2 est celui qu'on a recherché et sur lequel on clique (envoyé dans le corps de la requête)
            const { receiverId } = req.body;

            if (!receiverId) {
                return res.status(400).json({ success: false, message: "L'identifiant du destinataire (receiverId) est requis." });
            }

            // Appel de la méthode existante du modèle
            const conversationId = await ChatModel.getOrCreateConversation(userOneId, receiverId);

            return res.status(200).json({
                success: true,
                conversationId: conversationId
            });
        } catch (error) {
            console.error("Erreur initializeConversation:", error);
            return res.status(500).json({ success: false, message: "Erreur serveur lors de la création de la conversation." });
        }
    },

    // Fonction interne pour sauvegarder un nouveau message envoyé (chiffrement inclus)
    storeNewMessage: async (conversationId, senderId, plainText) => {
        try {
            // 1. Chiffrer le texte reçu
            const { encryptedData, iv } = encryptMessage(plainText);

            // 2. Sauvegarder dans MySQL
            const messageId = await ChatModel.saveMessage(conversationId, senderId, encryptedData, iv);
            
            return {
                success: true,
                messageId
            };
        } catch (error) {
            console.error("Erreur storeNewMessage:", error);
            return { success: false, error: error.message };
        }
    },

    // Récupérer l'historique complet d'une discussion (déchiffrement inclus)
    getChatHistory: async (req, res) => {
        try {
            const { conversationId } = req.params;
            
            // 1. Récupérer les lignes chiffrées depuis le modèle
            const rawMessages = await ChatModel.getMessagesByConversation(conversationId);

            // 2. Parcourir et déchiffrer chaque message pour le renvoyer en clair au client légitime
            const decryptedMessages = rawMessages.map(msg => ({
                id: msg.id,
                sender_id: msg.sender_id,
                sender_name: msg.sender_name,
                text: decryptMessage(msg.message_text, msg.iv), // Le texte redevient lisible ici
                is_read: msg.is_read,
                created_at: msg.created_at
            }));

            return res.status(200).json({
                success: true,
                data: decryptedMessages
            });
        } catch (error) {
            console.error("Erreur getChatHistory:", error);
            return res.status(500).json({ success: false, message: "Erreur serveur lors de la récupération du chat." });
        }
    },

    getAllMessages : async(req, res)=>{
        try{
                const resultat = await ChatModel.getAllMessages();

                const decryptedMessages = resultat.map(msg => ({
                id: msg.id,
                sender_id: msg.sender_id,
                sender_name: msg.sender_name,
                text: decryptMessage(msg.message_text, msg.iv), // Le texte redevient lisible ici
                is_read: msg.is_read,
                created_at: msg.created_at
            }));

            return res.status(200).json({
                success:true,
                data : decryptedMessages
            })

        }
        catch(err){
            res.status(200).json({
                success:false,
                message:err.message
            })
        }
    }
};

module.exports = ChatController;