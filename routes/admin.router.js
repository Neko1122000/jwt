const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');
const auth = require('../middleware/roleVerify');
const productManager = require('../controllers/product.controller');

router.use('/', auth.verify);
router.get('/profile', adminController.detail);
router.delete('/delete/:id', adminController.delete_user);

router.post('/product/newProduct', productManager.product_create);
router.put('/product/update', productManager.product_update);
router.delete('/product/delete/:id', productManager.product_delete);

module.exports = router;