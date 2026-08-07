const Intercession = require('../models/intercessionModel');

const supportPrayer = async (prayerId, userId) => {
    const result = await Intercession.add(prayerId, userId);
    if (!result) throw new Error("Vous avez déjà prié pour cette intention.");
    return result;
};

const countPrayter = async (prayerId)=>{
    
    const total = await Intercession.getCountByPrayer(prayerId);

    return total;
}
module.exports = { supportPrayer, countPrayter};