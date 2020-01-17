const express = require('express');
const router = express.Router();
const userListController = require('../controllers/userListController');
const productManager = require('../controllers/product.controller');

router.post('/signup', userListController.create);
router.post('/signin', userListController.signin);
router.get('/list', userListController.list);

router.get('/product/list', productManager.list);
router.get('/product/:id', productManager.product_detail);

const action = require('../routes/action.router');
router.use('/user', action);

router.get('/home', function (req, res) {
        res.send('welcome');
})

module.exports = router;