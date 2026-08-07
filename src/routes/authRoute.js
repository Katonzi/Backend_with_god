const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../middlewares/uploadMiddleware'); 



router.post('/register', authController.register);
router.post('/login', authController.login);



module.exports = router;   