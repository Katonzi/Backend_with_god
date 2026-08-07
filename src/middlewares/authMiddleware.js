const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ success: false, message: "Accès refusé. Connectez-vous d'abord." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // On attache l'utilisateur à la requête
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Session expirée ou invalide." });
    }
};
 