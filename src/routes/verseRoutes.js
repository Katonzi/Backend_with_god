const express = require('express');
const router = express.Router();
const verseController = require('../controllers/verseController');
const auth = require('../middlewares/authMiddleware');

// Route publique (pour l'utilisateur)
router.get('/today', auth, verseController.getToday);

// Route admin (pour l'instant sans protection, on la sécurisera après)
router.post('/add', verseController.postVerse);

module.exports = router;  