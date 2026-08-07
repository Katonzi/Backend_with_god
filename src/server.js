require("./config/db");
const app = require('./app');
const http = require('http'); // Module natif de Node.js
const { Server } = require('socket.io');
const PORT = process.env.PORT || 8000

const server = http.createServer(app);
const ChatController = require('./controllers/chatController');

// 2. Initialise Socket.io sur ce serveur avec la configuration CORS   
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"] 
  }  
});

io.on('connection', (socket) => {
  console.log(`⚡ Un appareil est connecté au à with god (Socket ID: ${socket.id})`);

  // 1. Événement : L'utilisateur ouvre une discussion spécifique
  socket.on('join_conversation', ({ conversationId }) => {
    try {
      if (!conversationId) {
        console.error("⚠️ Tentative de connexion à un salon sans conversationId valide.");
        return;
      }

      const roomName = `chat_${conversationId}`;
      
      // On connecte la socket directement au salon virtuel (room)
      socket.join(roomName);
      
      console.log(`👥 Un appareil a rejoint le salon virtuel : ${roomName}`);
    } catch (error) {
      console.error("Erreur lors du join_conversation:", error);
    }
  });

  // 2. Événement : L'utilisateur appuie sur "Envoyer"
  socket.on('send_message', async (data) => {
    try {
      const { conversationId, senderId, text } = data;

      console.log(`📨 Tentative d'envoi de message dans la conversation ${conversationId} par l'utilisateur ${senderId}`) ;

      // SÉCURITÉ : Validation stricte de la présence et du contenu des champs requis
      if (!conversationId || !senderId || !text || text.trim() === '') {
        console.error("⚠️ Données incomplètes ou invalides reçues pour l'envoi du message :", data);
        return;
      }

      // Conversion propre en entiers pour éviter le piège du "NaN" avec MySQL
      const cleanConversationId = parseInt(conversationId, 10);
      const cleanSenderId = parseInt(senderId, 10);

      if (isNaN(cleanConversationId) || isNaN(cleanSenderId)) {
        console.error(`⚠️ Erreur de type : conversationId (${conversationId}) ou senderId (${senderId}) impossible à convertir en nombre.`);
        return;
      }

      const roomName = `chat_${cleanConversationId}`;

      // En arrière-plan : On chiffre et on sauvegarde le message dans MySQL via le contrôleur
      const saveResult = await ChatController.storeNewMessage(cleanConversationId, cleanSenderId, text.trim());

      if (saveResult && saveResult.success) {
        // On prépare l'objet du message à propager en direct au format attendu par le Front
        const messagePayload = {
          id: saveResult.messageId,
          conversation_id: cleanConversationId,
          sender_id: cleanSenderId,
          text: text.trim(), // Transmis en clair dans le canal chiffré TLS/SSL des clients connectés
          created_at: new Date()
        };

        // On diffuse le message instantanément à TOUS ceux qui sont présents dans la room
        io.to(roomName).emit('receive_message', messagePayload);
        console.log(`✉️ Message de ${cleanSenderId} enregistré dans MySQL et diffusé dans ${roomName}`);
      } else {
        console.error("❌ Le contrôleur a échoué à enregistrer le message :", saveResult?.error);
      }

    } catch (error) {
      console.error("❌ Erreur critique lors de l'envoi du message (Socket server.js):", error);
    }
  });

  // 3. Événement : Déconnexion
  socket.on('disconnect', () => {
    console.log(`❌ Un appareil s'est déconnecté (${socket.id})`);
  });
});

server.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});     