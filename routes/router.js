const user = require('../controllers/userController');
const product = require('../controllers/productController');
const auth = require('../middleware/authentication');
const express = require('express');
const router = express.Router();

router.post('/api/v1/user/register', user.register);                // user.register
router.post('/api/v1/user/login', user.login);                      // user.login
router.get('/api/v1/user/me',auth.authenticate, user.getSingleUser);                  // user.getSingleUser
router.get('/api/v1/user/orders',auth.authenticate, user.getOrders);                  // user.getOrders
router.put('/api/v1/user', auth.authenticate, user.update);                           // user.update
router.put('/api/v1/user/change-password',auth.authenticate, user.changePassword);    // user.changePassword

router.get('/api/v1/users', auth.authenticate, auth.isAdmin, user.getUsers);                          // user.getUsers
router.delete('/api/v1/users/:id', auth.authenticate, auth.isAdmin, user.delete);
router.put('/api/v1/users/:id', auth.authenticate, auth.isAdmin, user.toAdmin);

router.put('/api/v1/products/:id', auth.authenticate, auth.isAdmin, product.update);                  // product.update
router.delete('/api/v1/products/:id', auth.authenticate, auth.isAdmin, product.delete); // product.delete
router.post('/api/v1/products', auth.authenticate, auth.isAdmin, product.create);                     // product.create

router.get('/api/v1/products', product.getProducts);                 // product.getProducts
router.get('/api/v1/products/:id', product.getSingleProduct);        // product.getSingleProduct
router.post('/api/v1/products/:id/checkout', auth.authenticate, product.checkout);      // product.checkout

module.exports = router;