const Prayer = require('../models/prayerModel');

const prayerService = {
    postNewPrayer: async (userId, prayerData) => {
        const {description, isAnonymous} = prayerData;
        if (!description) throw new Error("La description est obligatoire pour prier.");
        return await Prayer.create(userId, description, isAnonymous || false);
    },

    fetchWall: async () => {
        return await Prayer.getAll() 
    },

    getUserPrayersStats: async (userId) => {
        if(!userId) throw new Error("L'identifiant de l'utilisateur est requis pour obtenir les statistiques de prières.");
        return await Prayer.countByUserId(userId);
    },  

    getUserPrayers: async (userId) => {
        if(!userId) throw new Error("L'identifiant de l'utilisateur est requis pour obtenir les prières.");
        return await Prayer.findByUserId(userId);
    },
    removePrayers: async(idPrayers)=>{
        if(!idPrayers) throw new Error("L'identifiant de la prière manquant...");
        return await Prayer.removePrayers(idPrayers);
    },
    updatePrayers:async(idPrayers, description)=>{
        if(!description) throw new Error("La description de la prière est obligatoire!")
        return await Prayer.updatePrayers(idPrayers, description);
    }
}
 
module.exports = prayerService;