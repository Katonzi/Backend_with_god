const crypto = require('crypto');

// L'algorithme standard utilisé
const ALGORITHM = 'aes-256-cbc';

// Récupération de la clé secrète depuis tes variables d'environnement (.env)
// Si elle n'existe pas, on met une clé par défaut de 32 caractères pour le test.
const SECRET_KEY = process.env.CHAT_ENCRYPTION_KEY || '12345678901234567890123456789012'; 

/**
 * Chiffre un texte clair en AES-256-CBC
 * @param {string} text - Le message écrit par l'utilisateur
 * @returns {object} - Un objet contenant le texte chiffré et l'IV utilisé
 */
const encryptMessage = (text) => {
    // 1. Générer un IV aléatoire de 16 octets
    const iv = crypto.randomBytes(16);
    
    // 2. Créer le cipher (l'outil de chiffrement)
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
    
    // 3. Chiffrer le message
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // 4. On retourne le texte chiffré ET l'IV (sous forme de texte hexadécimal)
    return {
        encryptedData: encrypted,
        iv: iv.toString('hex')
    };
};

/**
 * Déchiffre un texte AES-256-CBC pour le rendre à nouveau lisible
 * @param {string} encryptedData - Le texte bizarre stocké en BDD
 * @param {string} ivHex - L'IV qui avait servi à chiffrer ce message précis
 * @returns {string} - Le message original en clair
 */
const decryptMessage = (encryptedData, ivHex) => {
    try {
        // 1. Reconvertir l'IV textuel en Buffer binaire
        const iv = Buffer.from(ivHex, 'hex');
        
        // 2. Créer le decipher (l'outil de déchiffrement)
        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
        
        // 3. Déchiffrer le message
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    } catch (error) {
        console.error("Erreur de déchiffrement : Clé ou IV invalide.", error);
        return "[Message corrompu ou illisible]";
    }
};

module.exports = { encryptMessage, decryptMessage};   