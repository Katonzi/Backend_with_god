const Prayer = require('../models/prayerSoutienModel');

const PrayerService = {
   
    togglePrayerSupport: async (userId, prayerId) => {
        if (!userId || !prayerId) {
            throw new Error("Données manquantes pour traiter le soutien.");
        }

        // On vérifie l'état actuel dans la table de jointure
        const hasLiked = await Prayer.checkSupport(userId, prayerId);

        if (hasLiked) {
            // Si déjà aimé, on décrémente (retire de la table)
            await Prayer.removeSupport(userId, prayerId);
            return { supported: false, message: "Soutien retiré." };
        } else {
            // Si pas encore aimé, on incrémente (ajoute dans la table)
            await Prayer.addSupport(userId, prayerId);
            return { supported: true, message: "Soutien accordé avec succès." };
        }
    }
};

module.exports = PrayerService;