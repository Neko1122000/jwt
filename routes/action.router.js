const express = require('express');
const router = express.Router();

const auth = require('../middleware/Authentication');
const userController = require('../controllers/user.controller');
const admin = require('../routes/admin.router')

router.use('/', auth.authencate);
router.get('/profile', userController.detail);
//router.get('/logout', userController.logOut);
router.put('/update', userController.userUpdate);

router.post('/product/:id', userController.buy);
router.delete('/product/:id', userController.delete);
router.put('/product/:id', userController.update);
router.get('/product/:id', userController.getSingleProduct);
router.get('/products/:page', userController.getProducts);
router.get('/purchase', userController.purchase);

router.use('/admin', admin);

module.exports = router;