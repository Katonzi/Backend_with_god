const express = require('express');
const router = express.Router();
const intercessionController = require('../controllers/intercessionController');
const auth = require('../middlewares/authMiddleware');

// Route protégée : il faut être connecté pour dire qu'on a prié
router.post('/:prayerId', auth, intercessionController.support);
router.get('/count/:prayerId', auth, intercessionController.countPrayersController);

module.exports = router;