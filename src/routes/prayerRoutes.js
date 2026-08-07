const express = require('express');
const router = express.Router();
const prayerController = require('../controllers/prayerController');
const auth = require('../middlewares/authMiddleware');

// Tout le monde peut voir le mur
router.get('/get/all-prayers', auth, prayerController.getWall); 
router.get('/get/user-stats', auth, prayerController.getUserPrayers);
router.get('/get/user-prayers', auth, prayerController.getUserPrayersList);
// Seuls les utilisateurs authentifiés peuvent poster des prières

// Il faut être connecté pour poster (on utilise le middleware 'auth')
router.post('/post/create-prayers', auth, prayerController.create);
//Modification de la prière.
router.put('/patch/:prayerId', auth, prayerController.updatePrayers)
//Une route de suppression d'une prière
router.delete('/delete/:prayerId', auth, prayerController.removePrayers)

module.exports = router;