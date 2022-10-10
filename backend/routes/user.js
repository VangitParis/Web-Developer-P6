const express = require('express');
const router = express.Router();
const password = require('../middleware/password');

//appel de la const crtl pour accéder aux routes utilisateurs
const userCtrl = require('../controllers/user');

//accéder aux API utilisateurs
router.post('/signup',password, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;