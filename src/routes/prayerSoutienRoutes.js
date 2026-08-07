const express = require('express');
const router = express.Router();
const PrayerController = require('../controllers/prayerSoutienController');
const verifyToken = require('../middlewares/authMiddleware');

// Nouvelle route pour incrémenter/décrémenter les j'aime
router.post('/post/toggle-support', verifyToken, PrayerController.toggleSupport); 

module.exports = router;