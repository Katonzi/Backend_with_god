require("./config/db");

const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
const ChatController = require('./controllers/chatController');

// ============================================================
// SOCKET.IO
// ============================================================

const io = new Server(server, {
    cors: {
        origin: process.env.SERVER_HOST,
        methods: ["GET", "POST"]
    }
});

// ============================================================
// CONNEXION D'UN CLIENT
// ============================================================

io.on('connection', (socket) => {

    console.log(`⚡ Un appareil est connecté à With God (Socket ID: ${socket.id})`);

    // ========================================================
    // REJOINDRE LE FLUX GLOBAL DES MESSAGES
    // ========================================================

    socket.on('join_global_inbox', ({ userId }) => {
        try {
            if (!userId) {
                console.error("⚠️ Tentative de connexion au flux global sans userId.");
                return;
            }

            const cleanUserId = parseInt(userId, 10);

            if (isNaN(cleanUserId)) {
                console.error(`⚠️ userId invalide pour le flux global : ${userId}`);
                return;
            }

            const globalRoom = `global_inbox_${cleanUserId}`;

            socket.join(globalRoom);
            socket.userId = cleanUserId;

            console.log(`📥 Un appareil a rejoint le flux global : ${globalRoom}`);
        } catch (error) {
            console.error("❌ Erreur lors du join_global_inbox :", error);
        }
    });

    // ========================================================
    // REJOINDRE UNE CONVERSATION PRIVÉE
    // ========================================================

    socket.on('join_conversation', ({ conversationId }) => {
        try {
            if (!conversationId) {
                console.error("⚠️ Tentative de connexion à un salon sans conversationId valide.");
                return;
            }

            const cleanConversationId = parseInt(conversationId, 10);

            if (isNaN(cleanConversationId)) {
                console.error(`⚠️ conversationId invalide : ${conversationId}`);
                return;
            }

            const roomName = `chat_${cleanConversationId}`;

            socket.join(roomName);

            console.log(`👥 Un appareil a rejoint le salon : ${roomName}`);
        } catch (error) {
            console.error("❌ Erreur lors du join_conversation :", error);
        }
    });

    // ========================================================
    // QUITTER UNE CONVERSATION
    // ========================================================

    socket.on('leave_conversation', ({ conversationId }) => {
        try {
            if (!conversationId) return;

            const cleanConversationId = parseInt(conversationId, 10);

            if (isNaN(cleanConversationId)) return;

            const roomName = `chat_${cleanConversationId}`;

            socket.leave(roomName);

            console.log(`🚪 Un appareil a quitté le salon : ${roomName}`);
        } catch (error) {
            console.error("❌ Erreur lors du leave_conversation :", error);
        }
    });

    // ========================================================
    // ENVOYER UN MESSAGE
    // ========================================================

    socket.on('send_message', async (data) => {
        try {
            const { conversationId, senderId, text } = data;

            console.log(
                `📨 Tentative d'envoi de message dans la conversation ${conversationId} par l'utilisateur ${senderId}`
            );

            // --------------------------------------------------
            // VALIDATION DES DONNÉES
            // --------------------------------------------------

            if (
                !conversationId ||
                !senderId ||
                !text ||
                typeof text !== 'string' ||
                text.trim() === ''
            ) {
                console.error(
                    "⚠️ Données incomplètes ou invalides reçues pour l'envoi du message :",
                    data
                );
                return;
            }

            // --------------------------------------------------
            // CONVERSION DES IDENTIFIANTS
            // --------------------------------------------------

            const cleanConversationId = parseInt(conversationId, 10);
            const cleanSenderId = parseInt(senderId, 10);

            if (isNaN(cleanConversationId) || isNaN(cleanSenderId)) {
                console.error(
                    `⚠️ Erreur de type : conversationId (${conversationId}) ou senderId (${senderId}) impossible à convertir en nombre.`
                );
                return;
            }

            const roomName = `chat_${cleanConversationId}`;

            // ==================================================
            // SAUVEGARDE VIA LE CONTROLLER
            // ==================================================

            const saveResult = await ChatController.storeNewMessage(
                cleanConversationId,
                cleanSenderId,
                text.trim()
            );

            if (!saveResult || !saveResult.success) {
                console.error(
                    "❌ Le contrôleur a échoué à enregistrer le message :",
                    saveResult?.error
                );
                return;
            }

            // ==================================================
            // MESSAGE RETOURNÉ PAR LE CONTROLLER
            // ==================================================

            const messagePayload = saveResult.message;

            if (!messagePayload) {
                console.error(
                    "❌ Le message a été enregistré mais aucun payload n'a été retourné par le Controller."
                );
                return;
            }

            console.log(
                `✉️ Message ${messagePayload.id} de ${messagePayload.sender_name} enregistré avec succès.`
            );

            // ==================================================
            // 1. DIFFUSION DANS LA CONVERSATION PRIVÉE
            // ==================================================

            io.to(roomName).emit('receive_message', messagePayload);

            console.log(
                `📡 Message ${messagePayload.id} diffusé dans ${roomName}`
            );

            // ==================================================
            // 2. DIFFUSION DANS LES FLUX GLOBAUX
            // ==================================================

            const conversationUsers =
                await ChatController.getConversationUsers(
                    cleanConversationId
                );

            if (conversationUsers && conversationUsers.length > 0) {
                conversationUsers.forEach((userId) => {
                    const cleanUserId = parseInt(userId, 10);

                    if (isNaN(cleanUserId)) return;

                    const globalRoom = `global_inbox_${cleanUserId}`;

                    io.to(globalRoom).emit(
                        'receive_message',
                        messagePayload
                    );

                    console.log(
                        `📥 Message ${messagePayload.id} envoyé au flux global ${globalRoom}`
                    );
                });
            }

        } catch (error) {
            console.error(
                "❌ Erreur critique lors de l'envoi du message (server.js) :",
                error
            );
        }
    });

    // ========================================================
    // DÉCONNEXION
    // ========================================================

    socket.on('disconnect', (reason) => {
        console.log(
            `❌ Un appareil s'est déconnecté (${socket.id}) — raison : ${reason}`
        );
    });
});

// ============================================================
// DÉMARRAGE DU SERVEUR
// ============================================================

server.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
