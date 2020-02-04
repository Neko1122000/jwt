const User = require('../models/User.model');
const Product = require('../models/product.model');
const BuyList = require('../models/buyList.model');
const bcrypt = require('bcryptjs');

exports.detail = async (req, res) => {
    try {
        const result = await User.findById(req.userId)
                                 .select({hash_password: 0}).lean();
        res.status(200).send(result);
    } catch (e) {
        const message = e.message
        res.status(404).send(message);
    }
};

exports.userUpdate = async (req, res) => {
    try {
        if (req.body.password) req.body.hash_password = bcrypt.hashSync(req.body.password, 10);
        const result = await User.findByIdAndUpdate(req.userId, {$set: req.body}, {useFindAndModify: false, new: true}).lean();

        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        const message = err.message;
        res.status(500).send(message);
    }
};

// exports.logOut = async (req, res) => {
//     await delete req.headers['Authorization'];
//     res.redirect('/home');
// };

exports.buy = async (req, res) => {
    try {
        const {params: {id: productId}, body: {quantity: quantity}, userId: userId} = req;
        const newProduct = await BuyList.create({
            product_id: productId,
            quantity: quantity,
            user_id: userId,
        });
        res.status(200).send(newProduct);
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }

};

exports.delete = async (req, res) => {
    try {
        const {params: {id: id}, userId: userId} = req;
        await BuyList.findOneAndDelete({_id: id, user_id: userId}, {useFindAndModify: false});
        res.redirect('/user/products');
    } catch (e) {
        const message = e.message
        return res.status(500).send('Deleting false: ' + message);
    }
};

exports.update = async (req, res) => {
    try {
        const {params: {id: id}, body: {quantity: quantity}, userId: userId} = req;

        const product = await BuyList.findOneAndUpdate({_id: id, user_id: userId}, {$set: {quantity: quantity,     date: Date.now()}}, {new: true, useFindAndModify: false});
        res.status(200).send(product);
    } catch (e) {
        const message = e.message;
        return res.status(500).send(message);
    }
};

exports.getSingleProduct = async (req, res) => {
    try {
        const {params: {id: id}, userId: userId} = req;
        const product = await BuyList.findOne({_id: id, user_id: userId});
        res.status(200).send(product);
    } catch (e) {
        const message = e.message;
        return res.status(500).send(message);
    }
};

exports.getProducts = async (req, res) => {
    try {
        const userId = req.userId;
        const perPage = 2;
        const N = req.params.page;
        const list = await BuyList.find({user_id: userId})
                                  .skip(N*perPage)
                                  .limit(perPage)
                                  .sort({created_at: 1});;
        res.status(200).send(list);
    } catch (e) {
        const message = e.message;
        return res.status(500).send(message);
    }
};

exports.purchase = async (req, res) => {
    try {
        const userId = req.userId;
        const purchaseList = await BuyList.findAndModify({query: {user_id: userId}, remove: true,});
        res.status(200).send(purchaseList);
    } catch (e) {
        const message = e.message;
        //console.log(e);
        return res.status(500).send(message);
    }
};