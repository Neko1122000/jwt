const user = require('../controllers/user.controller');
const product = require('../controllers/product.controller');
const auth = require('../middleware/authentication');
const express = require('express');
const router = express.Router();

router.post('/api/v1/user/register', user.register);                // user.register
router.post('/api/v1/user/login', user.login);                      // user.login
router.get('/api/v1/user/me',auth.authencate, user.getSingleUser);                  // user.getSingleUser
router.get('/api/v1/user/orders',auth.authencate, user.getOrders);                  // user.getOrders
router.put('/api/v1/user', auth.authencate, user.update);                           // user.update
router.put('/api/v1/user/change-password',auth.authencate, user.changePassword);    // user.changePassword

router.get('/api/v1/users', auth.authencate, auth.verify, user.getUsers);                          // user.getUsers
router.delete('/api/v1/users/:id', auth.authencate, auth.verify, user.delete);

router.put('/api/v1/products/:id', auth.authencate, auth.verify, product.update);                  // product.update
router.delete('/api/v1/products/:id', auth.authencate, auth.verify, product.delete); // product.delete
router.post('/api/v1/products', auth.authencate, auth.verify, product.create);                     // product.create

router.get('/api/v1/products', product.getProducts);                 // product.getProducts
router.get('/api/v1/products/:id', product.getSingleProduct);        // product.getSingleProduct
router.post('/api/v1/products/:id/checkout', product.checkout);      // product.checkout

module.exports = router;