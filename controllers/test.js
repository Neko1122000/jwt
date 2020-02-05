// const User = require('../models/User.model');
// const buyList = require('../models/buyList.model');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const config = require('../config/config');
// const ejs = require('ejs');

// const express = require('express');
// const router = express.Router();
// const userListController = require('../controllers/userListController');
// const productManager = require('../controllers/product.controller');
//
// router.post('/signup', userListController.create);
// router.post('/signin', userListController.signIn);
// router.get('/users/:page', userListController.getUsers);
//
// router.get('/products/', productManager.getProducts);
// router.get('/products/:id', productManager.getSingleProduct);
//
// const action = require('../routes/action.router');
// router.use('/user', action);
//
// router.get('/home', function (req, res) {
//         res.json({greeting: 'welcome from server'});
// })

// exports.purchase = async (req, res) => {
//     try {
//         const userId = req.userId;
//         const purchaseList = await BuyList.findAndModify({query: {user_id: userId}, remove: true,});
//         res.status(200).send(purchaseList);
//     } catch (e) {
//         const message = e.message;
//         //console.log(e);
//         return res.status(500).send(message);
//     }
// };

// exports.logOut = async (req, res) => {
//     await delete req.headers['Authorization'];
//     res.redirect('/home');
// };

// exports.delete = async (req, res) => {
//     try {
//         const {params: {id: id}, userId: userId} = req;
//         await BuyList.findOneAndDelete({_id: id, user_id: userId}, {useFindAndModify: false});
//         res.redirect('/user/products');
//     } catch (e) {
//         const message = e.message;
//         return res.status(500).send('Deleting false: ' + message);
//     }
// };
//
// exports.update = async (req, res) => {
//     try {
//         const {params: {id: id}, body: {quantity: quantity}, userId: userId} = req;
//
//         const product = await BuyList.findOneAndUpdate({_id: id, user_id: userId}, {$set: {quantity: quantity,     date: Date.now()}}, {new: true, useFindAndModify: false});
//         res.status(200).send(product);
//     } catch (e) {
//         const message = e.message;
//         return res.status(500).send(message);
//     }
// };
