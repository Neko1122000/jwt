const express = require('express');
const router = express.Router();
const userListController = require('../controllers/userListController');
const productManager = require('../controllers/product.controller');

router.post('/signup', userListController.create);
router.post('/signin', userListController.signIn);
router.get('/users/:page', userListController.getUsers);

router.get('/products/', productManager.getProducts);
router.get('/products/:id', productManager.getSingleProduct);

const action = require('../routes/action.router');
router.use('/user', action);

router.get('/home', function (req, res) {
        res.send('welcome');
})

module.exports = router;