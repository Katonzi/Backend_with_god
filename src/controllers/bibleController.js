// Importation du service qui contient la logique métier et les validations
const BibleService = require('../services/bibleService');

class BibleController {

    // 1. Récupérer tous les livres
    async getAllBooks(req, res) {
        try {
            const books = BibleService.getBooksList();
            return res.status(200).json({
                success: true,
                data: books
            });
        } catch (error) {
            console.error("Erreur dans BibleController.getAllBooks:", error.message);
            return res.status(500).json({
                success: false,     
                message: "Erreur lors de la récupération des livres de la Bible."
            });
        }
    }  

    // 2. Récupérer le nombre de chapitres d'un livre
    async getChaptersCount(req, res) {
        try {
            const { bookId } = req.params;
            
            // Appel au service qui effectue la validation de l'ID et l'extraction
            const chaptersData = await BibleService.getChaptersCount(bookId);
            
            return res.status(200).json({        
                success: true,
                data: chaptersData
            });
        } catch (error) {
            console.error("Erreur dans BibleController.getChaptersCount:", error.message);
            
            // Si le message d'erreur vient de notre validation du service
            if (error.message.includes("invalide") || error.message.includes("inexistant")) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
 
            return res.status(500).json({
                success: false,
                message: "Erreur interne du serveur lors de la récupération des chapitres."
            });
        }
    }

    // 3. Récupérer les versets d'un chapitre spécifique
    async getChapterVerses(req, res) {
        try {
            const { bookId, chapterId } = req.params;
            
            // Appel au service pour validation et nettoyage des textes
            const chapterContent = await BibleService.getChapterVerses(bookId, chapterId);
            
            return res.status(200).json({
                success: true,
                data: chapterContent 
            });
        } catch (error) {
            console.error("Erreur dans BibleController.getChapterVerses:", error.message);
            
            // Gestion des erreurs de validation ou de contenu introuvable renvoyées par le service
            if (error.message.includes("invalide") || error.message.includes("n'existe pas")) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: "Erreur interne du serveur lors de la récupération des versets."
            });
        }
    }

    
//Filtrer les résultats de la recherche en temps réel d'un verset.
async search(req, res) {
    try {
        // Récupération du paramètre "q" depuis l'URL (ex: /api/bible/search?q=amour)
        const { q } = req.query;
        
        const results = await BibleService.searchVerses(q);
        
        return res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error("Erreur dans BibleController.search:", error.message);
        
        if (error.message.includes("au moins 3 caractères")) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        
        return res.status(500).json({
            success: false,
            message: "Erreur lors de la recherche globale des versets."
        });
    }
}
}

module.exports = new BibleController();