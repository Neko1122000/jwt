const express = require('express');
const router = express.Router();

const auth = require('../middleware/Authentication');
const userController = require('../controllers/user.controller');
const admin = require('../routes/admin.router')

router.use('/', auth.authencate);
router.get('/profile', userController.detail);
router.get('/logout', userController.logout);
router.post('/product/buy', userController.buy);
router.delete('/product/remove', userController.delete_product);
router.put('/product/update', userController.update_product);
router.get('/product/detail', userController.product_detail)

router.use('/admin', admin);

module.exports = router;