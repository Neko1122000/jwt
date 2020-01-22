const User = require('../models/User.model');
const Product = require('../models/product.model');
const BuyList = require('../models/buyList.model');

exports.detail = async (req, res) => {
    try {
        const result = await User.findById(req.userId)
                                 .select({hash_password: 0});
        res.status(200).send(result);
    } catch (e) {
        res.status(404).send('No User found');
        console.log(e);
    }
};

exports.userUpdate = async (req, res) => {
    try {
        const result = await User.findByIdAndUpdate(req.userId, {$set: req.body});
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send('Listing Error');
    }
};

// exports.logOut = async (req, res) => {
//     await delete req.headers['Authorization'];
//     res.redirect('/home');
// };

exports.buy = async (req, res) => {
    try {
        const {params: {id: productId}, body: {number}} = req;

        const user = await User.findById(req.userId).populate({path: 'buy', populate: 'nested.product'});
        const product = await Product.findById(productId);
        if (!product) throw new Error('Product not for sell');
        if (!BuyList.findOne({_id: user.buy._id, 'nested.product': productId}))
            await BuyList.updateOne({_id: user.buy._id}, {$push: {nested: {product: productId, number}}});
        else await BuyList.updateOne({_id: user.buy._id, 'nested.product': productId}, {$inc: {'nested.$.number': number}});
        res.status(200).send(user.buy.nested);
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }

};

exports.delete = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate({path: 'buy', populate: 'nested.product'});
        const {params: {id: productId}} = req;

        await BuyList.updateOne({_id: user.buy._id}, {$pull: {nested: {product: productId}}});
        res.status(200).send(user.buy.nested);
        // TODO: callback order?
    } catch (e) {
        return res.status(500).send('Deleting false: ' + e.message);
    }
};

exports.update = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate({path: 'buy', populate: 'nested.product'});
        const {params: {id: productId}, body: {number}} = req;

        await BuyList.updateOne({_id: user.buy._id, 'nested.product': productId}, {$set: {'nested.$.number': number}});
        res.status(200).send(user.buy.nested);
    } catch (e) {
        const message = e.message;
        return res.status(500).send(message);
    }
};

exports.getSingleProduct = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate({path: 'buy', populate: 'nested.product'});
        const list = user.buy.nested;
        const pos = await list.findIndex(element => element.product._id == req.params.id);

        if (pos != -1) {
            res.status(200).send(list[pos]);
        } else throw new Error('Product not found');

        //const {params: {id: productId}} = req;
        //const product = await BuyList.findOne({_id: user.buy._id, 'nested.product': productId});
        //res.status(200).send(product);
    } catch (e) {
        const message = e.message;
        return res.status(500).send(message);
    }
};

exports.getProducts = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
                               .populate({path: 'buy', populate: {path: 'nested.product'}});
        const list = user.buy.nested;
        res.status(200).send(list);
    } catch (e) {
        const message = e.message;
        return res.status(500).send(message);
    }
};

exports.purchase = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate({path: 'buy', populate: 'nested.product'});
        const purchaseList = user.buy.nested;

        // TODO: Research Array.reduce();

        let sum = 0;
        for (let element of purchaseList) {
            sum += element.product.price * element.number;
        }

        // for (let i in user.buy.nested) {
        // }

        if (sum > user.money) return res.status(200).send('Not enough to purchase');

        user.money -= sum;
        user.buy.nested.length = 0;
        user.save();

        res.status(200).send(user);
    } catch (e) {
        const message = e.message;
        console.log(e);
        return res.status(500).send(message);
    }
};