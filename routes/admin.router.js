const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');
const auth = require('../middleware/roleVerify');

router.use('/', auth.verify);
router.get('/profile', adminController.detail);
router.delete('/delete/:id', adminController.delete);

module.exports = router;