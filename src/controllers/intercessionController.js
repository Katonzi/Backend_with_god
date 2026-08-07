const intercessionService = require('../services/intercessionService');

exports.support = async (req, res) => {
    try {
        const userId = req.user.id;
        const { prayerId } = req.params;
        
        await intercessionService.supportPrayer(prayerId, userId);
        
        res.status(201).json({
            success: true,
            message: "Amen ! Votre soutien a été enregistré."
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


exports.countPrayersController = async(req, res)=>{
    try{
        const {prayerId} = req.params;
        const result = await intercessionService.countPrayter(prayerId);

        return res.status(200).json({
            success:true,
            message:"Les prières comptées avec succès",
            total:result
        })
    }
    catch(err){
        return res.status(400).json({Erreur : err.message});
    }
}