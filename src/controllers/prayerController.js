const prayerService = require('../services/prayerService');

exports.create = async (req, res) => {
    try {
        // L'ID vient du middleware d'auth qui est middleware de connection qu'on a crée.
        const userId = req.user.id; 
        const description = req.body
        if(!userId) throw new Error("Utilisateur non identifié...");
        const result = await prayerService.postNewPrayer(userId, description);
        
        res.status(201).json({
            success: true,
            message: "Votre intention a été déposée sur le mur.",
            id:result.id
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
        console.log("La requêtes recu du client : ", error);
    }
};

exports.getWall = async (req, res) => {
    try {
        const prayers = await prayerService.fetchWall(); 
        res.status(200).json({
            success: true,
            data: prayers
        });
    } catch (error) { 
        res.status(500).json({ success: false, message: error.message });   
    }
};

exports.getUserPrayers = async (req, res) => {   
        try {
            // req.user est rempli par le middleware de vérification de token (authMiddleware)
            const userId = req.user.id; 

            const stats = await prayerService.getUserPrayersStats(userId);
            
            return res.status(200).json({
                success: true,
                count: stats
            });
        } catch (error) {
            console.error("Erreur dans getUserPrayers :", error.message);
            return res.status(500).json({
                success: false,
                message: "Erreur lors de la récupération des statistiques de prières."
            });
        }};

exports.getUserPrayersList = async (req, res) => {
    try {
        const userId = req.user.id; 
        const prayers = await prayerService.getUserPrayers(userId);
        return res.status(200).json({
            success: true,
            data: prayers
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des prières de l'utilisateur."
        });
    }
};
exports.removePrayers = async(req, res)=>{
    try{
        const idUser = req.user.id;
        const {prayerId} = req.params;
        
        const result = await prayerService.removePrayers(prayerId)
        return res.status(200).json({
            success:true,
            message:`La prayers avec l'identifier ${prayerId} supprimer avec succès !`
        })
    }catch(error){
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
exports.updatePrayers = async(req, res)=>{
    try{
        const idUser = req.user.id;
        const {prayerId} = req.params;
        const {description} = req.body;
        
        if(!prayerId) throw new Error("L'identifiant de la prière manquant!")
        const result = await prayerService.updatePrayers(prayerId, description);

         res.status(200).json({
            success:true,
            message:`La prière avec l'identifiant ${prayerId} modifiée avec succès!`
        })
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}