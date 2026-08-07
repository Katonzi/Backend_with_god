const PrayerService = require('../services/prayerSoutienService');

const PrayerController = {

    // Nouvelle méthode pour le bouton J'aime (Soutenir)
    toggleSupport: async (req, res) => {
        try {
            const userId = req.user.id; // Injecté par ton middleware d'authentification
            const { prayerId } = req.body; // Reçu depuis l'application mobile

            const result = await PrayerService.togglePrayerSupport(userId, prayerId);
            return res.status(200).json({ success: true, ...result });
        } catch (error) {
            console.error("Erreur toggleSupport :", error.message);
            return res.status(500).json({ success: false, message: "Erreur traitement soutien." });
        }
    }
};

module.exports = PrayerController;