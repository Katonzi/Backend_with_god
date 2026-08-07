const authService = require('../services/authService');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if(!username || !email || !password){
            throw new Error ("Tous les champs sont requis.")
        }
        const result = await authService.register(username, email, password);
        
        res.status(201).json({
            success: true,
            data: result,  
            message: `✅ Votre compte "With God" a été créé avec succès ! Vous pouvez maintenant vous connecter dans : `
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            throw new Error ("Email et mot de passe requis.")
        }
        const result = await authService.login(email, password);
        
        res.status(200).json({
            success: true,
            data: result,
            message: "✅ Connexion réussie ! Bienvenue sur With God."
        });
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
};

exports.findByName = async(req, res)=>{
    try{
        const {username} = req.query;
        
        const result = await authService.findByName(username);


        res.status(200).json({
            success:true,
            data:result
        })
    }catch(err){
        console.error("Erreur de récupération utilisateur : ", err);
        return res.status(400).json({
            success:false,
            message:'Erreur de récupération utilisateur ' + err.message
        });
    }
}