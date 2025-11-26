const { Router } = require('express');
const userCtrl = require('../controllers/user');
const movieCtrl = require('../controllers/movie');
const videoCtrl = require('../controllers/video');
const categoryCtrl = require('../controllers/category');
const router = Router();

// User
router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);

// Category
router.post('/categories', categoryCtrl.create);
router.get('/categories', categoryCtrl.list);

// Movie
router.post('/movies', movieCtrl.create);
router.get('/movies', movieCtrl.search);

// Video
router.post('/videos', videoCtrl.create);
router.get('/videos', videoCtrl.list);

module.exports = router;