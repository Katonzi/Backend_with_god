// Importation du modèle qui communique avec la base de données
const BibleModel = require('../models/bibleModel');

// Le dictionnaire complet des 66 livres (logique métier fixe)      
const BIBLE_BOOKS = {
    1: { name: "Genèse", testament: "Ancien" }, 2: { name: "Exode", testament: "Ancien" },
    3: { name: "Lévitique", testament: "Ancien" }, 4: { name: "Nombres", testament: "Ancien" },
    5: { name: "Deutéronome", testament: "Ancien" }, 6: { name: "Josué", testament: "Ancien" },
    7: { name: "Juges", testament: "Ancien" }, 8: { name: "Ruth", testament: "Ancien" },
    9: { name: "1 Samuel", testament: "Ancien" }, 10: { name: "2 Samuel", testament: "Ancien" },
    11: { name: "1 Rois", testament: "Ancien" }, 12: { name: "2 Rois", testament: "Ancien" },
    13: { name: "1 Chroniques", testament: "Ancien" }, 14: { name: "2 Chroniques", testament: "Ancien" },
    15: { name: "Esdras", testament: "Ancien" }, 16: { name: "Néhémie", testament: "Ancien" },
    17: { name: "Esther", testament: "Ancien" }, 18: { name: "Job", testament: "Ancien" },
    19: { name: "Psaumes", testament: "Ancien" }, 20: { name: "Proverbes", testament: "Ancien" },
    21: { name: "Ecclésiaste", testament: "Ancien" }, 22: { name: "Cantique des Cantiques", testament: "Ancien" },
    23: { name: "Ésaïe", testament: "Ancien" }, 24: { name: "Jérémie", testament: "Ancien" },
    25: { name: "Lamentations", testament: "Ancien" }, 26: { name: "Ézéchiel", testament: "Ancien" },
    27: { name: "Daniel", testament: "Ancien" }, 28: { name: "Osée", testament: "Ancien" },
    29: { name: "Joël", testament: "Ancien" }, 30: { name: "Amos", testament: "Ancien" },
    31: { name: "Abdias", testament: "Ancien" }, 32: { name: "Jonas", testament: "Ancien" },
    33: { name: "Michée", testament: "Ancien" }, 34: { name: "Nahum", testament: "Ancien" },
    35: { name: "Habacuc", testament: "Ancien" }, 36: { name: "Sophonie", testament: "Ancien" },
    37: { name: "Aggée", testament: "Ancien" }, 38: { name: "Zacharie", testament: "Ancien" },
    39: { name: "Malachie", testament: "Ancien" },
    40: { name: "Matthieu", testament: "Nouveau" }, 41: { name: "Marc", testament: "Nouveau" },
    42: { name: "Luc", testament: "Nouveau" }, 43: { name: "Jean", testament: "Nouveau" },
    44: { name: "Actes", testament: "Nouveau" }, 45: { name: "Romains", testament: "Nouveau" },
    46: { name: "1 Corinthiens", testament: "Nouveau" }, 47: { name: "2 Corinthiens", testament: "Nouveau" },
    48: { name: "Galates", testament: "Nouveau" }, 49: { name: "Éphésiens", testament: "Nouveau" },
    50: { name: "Philippiens", testament: "Nouveau" }, 51: { name: "Colossiens", testament: "Nouveau" },
    52: { name: "1 Thessaloniciens", testament: "Nouveau" }, 53: { name: "2 Thessaloniciens", testament: "Nouveau" },
    54: { name: "1 Timothée", testament: "Nouveau" }, 55: { name: "2 Timothée", testament: "Nouveau" },
    56: { name: "Tite", testament: "Nouveau" }, 57: { name: "Philémon", testament: "Nouveau" },
    58: { name: "Hébreux", testament: "Nouveau" }, 59: { name: "Jacques", testament: "Nouveau" },
    60: { name: "1 Pierre", testament: "Nouveau" }, 61: { name: "2 Pierre", testament: "Nouveau" },
    62: { name: "1 Jean", testament: "Nouveau" }, 63: { name: "2 Jean", testament: "Nouveau" },
    64: { name: "3 Jean", testament: "Nouveau" }, 65: { name: "Jude", testament: "Nouveau" },
    66: { name: "Apocalypse", testament: "Nouveau" }
};

class BibleService {

    // 1. Récupère et structure la liste complète des livres
    getBooksList() {
        const result =  Object.keys(BIBLE_BOOKS).map(id => ({
            id: parseInt(id),
            name: BIBLE_BOOKS[id].name,
            testament: BIBLE_BOOKS[id].testament    
        }));

         
        return result;
    }

    // 2. Récupère le nombre total de chapitres d'un livre avec validation de l'ID
    async getChaptersCount(bookId) {
        const id = parseInt(bookId);
        
        // Validation : Le champ doit être un nombre existant dans notre dictionnaire (1 à 66)
        if (isNaN(id) || !BIBLE_BOOKS[id]) {
            throw new Error("Livre invalide ou inexistant.");
        }

        const totalChapters = await BibleModel.getMaxChapter(id);
        
        return {
            bookId: id,
            bookName: BIBLE_BOOKS[id].name,
            totalChapters: totalChapters || 0
        };
    }

    // 3. Récupère et nettoie les versets d'un chapitre spécifique
    async getChapterVerses(bookId, chapterId) {
        const bId = parseInt(bookId);
        const cId = parseInt(chapterId);

        // Validation des champs obligatoires et formats
        if (isNaN(bId) || !BIBLE_BOOKS[bId]) {
            throw new Error("Livre spécifié invalide.");
        }
        if (isNaN(cId) || cId <= 0) {
            throw new Error("Numéro de chapitre invalide.");
        }

        // Appel au modèle pour obtenir les données brutes de la BDD
        const rawVerses = await BibleModel.getVersesByChapter(bId, cId);

        // Si aucun verset n'est retourné, le chapitre n'existe probablement pas dans ce livre
        if (!rawVerses || rawVerses.length === 0) {
            throw new Error("Ce chapitre n'existe pas pour ce livre.");
        }

        // Formatage / Nettoyage métier (On retire les caractères "¶" hérités du texte brut)
        const cleanVerses = rawVerses.map(v => ({
            id: v.id,
            verse: v.verse,
            text: v.text.replace('¶ ', '').trim()
        }));

        return {
            bookId: bId,
            bookName: BIBLE_BOOKS[bId].name,
            chapter: cId,
            verses: cleanVerses
        };
    }

//Fonction pour filtrer le résultat de la recherche d'un verset spécifique.
async searchVerses(queryKeyword) {
    // 1. Validation de sécurité : champ obligatoire et longueur minimale
    if (!queryKeyword || queryKeyword.trim().length < 3) {
        throw new Error("Le mot-clé de recherche doit contenir au moins 3 caractères.");
    }

    // 2. Appel au modèle
    const rawResults = await BibleModel.searchVersesByKeyword(queryKeyword.trim());

    // 3. Formatage métier : injecter le nom textuel du livre et nettoyer le texte du verset
    const formattedResults = rawResults.map(v => ({
        id: v.id,
        bookId: v.book,
        bookName: BIBLE_BOOKS[v.book]?.name || "Inconnu",
        chapter: v.chapter,
        verse: v.verse,
        text: v.text.replace('¶ ', '').trim()
    }));

    return formattedResults;
}
}

module.exports = new BibleService();