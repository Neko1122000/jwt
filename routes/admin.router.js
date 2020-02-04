const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');
const auth = require('../middleware/roleVerify');
const productManager = require('../controllers/product.controller');

router.use('/', auth.verify);
router.get('/profile', adminController.detail);
router.delete('/delete/:id', adminController.deleteUser);

router.get('/products', productManager.getProducts);
router.get('/products/:id', productManager.getSingleProduct);
router.post('/products/:page', productManager.create);
router.put('/products/:id', productManager.update);
router.delete('/products/:id', productManager.delete);

module.exports = router;