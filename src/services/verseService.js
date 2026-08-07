const Verse = require('../models/verseModel');

const getDailyContent = async () => {
    const verse = await Verse.getTodayVerse();
    if (!verse) {
        // Fallback : Si aucun verset n'est prévu aujourd'hui, on en renvoie un par défaut
        return {
            content: "car en lui nous avons la vie, le mouvement, et l’être. C’est ce qu’ont dit aussi quelques-uns de vos poètes: De lui nous sommes la race…",
            reference: "Actes 17:28",
            message: "Restez connectés à Sa présence."
        };
    }
    return verse;
};

const addVerse = async (verseData) => {
    // Ici on pourrait ajouter une logique de vérification de date
    return await Verse.create(verseData);
};

module.exports = { getDailyContent, addVerse };