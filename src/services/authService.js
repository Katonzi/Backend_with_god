const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const register = async (username, email, password) => { 
     
    const mot_de_passe = password.length < 6;
    
    if(mot_de_passe) throw new Error("Le mot de passe doit contenir au moins 6 caractères !");

    const existingUser = await User.findByEmail(email);
    if (existingUser) throw new Error("Cette adresse mail est déjà utilisée pour un autre compte.");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userId = await User.create(username, email, hashedPassword);
    return { userId};    
};

const login = async (email, password) => {
    const user = await User.findByEmail(email);
    if (!user) throw new Error("Compte introuvable ou email incorrect !");

    const isMatch = await bcrypt.compare(password, user.password);  
    if (!isMatch) throw new Error("Mot de passe incorrect.");


    // Générer le Token JWT
    const token = jwt.sign(
        { id: user.id, username: user.username, email:user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    await db.query(`UPDATE users SET date_connexion = NOW() WHERE id = ? `, [user.id]); 

    return { token, user: { id: user.id, username: user.username, email: user.email, derniere_connexion:user.date_connexion, creer_le:user.created_at } };
};

const findByName = async(username)=>{
    const rows = await User.findByName(username);

    return rows;
}

module.exports = { register, login, findByName }; 