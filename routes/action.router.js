const express = require('express');
const router = express.Router();

const auth = require('../middleware/Authentication');
const userController = require('../controllers/user.controller');
const admin = require('../routes/admin.router')

router.use('/', auth.authencate);
router.get('/profile', userController.detail);
router.get('/logout', userController.logout);
router.use('/admin', admin);

module.exports = router;