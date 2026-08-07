const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware')

// Importation du contrôleur
const BibleController = require('../controllers/bibleController');
//la route pour filtrer le résultat de la recherche d'un verset spécifique.
router.get('/search',auth, BibleController.search);
// 1. Route pour la liste des livres (Barre latérale)
router.get('/books', auth, BibleController.getAllBooks);

// 2. Route pour avoir le nombre de chapitres d'un livre
router.get('/books/:bookId/chapters', auth, BibleController.getChaptersCount);

// 3. Route pour afficher les versets d'un chapitre précis
router.get('/books/:bookId/chapters/:chapterId', auth, BibleController.getChapterVerses);



module.exports = router;