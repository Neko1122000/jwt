const User = require('../models/User.model');
const Product = require('../models/product.model');
const BuyList = require('../models/buyList.model');
const bcrypt = require('bcryptjs');

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
        if (req.body.password) req.body.hash_password = bcrypt.hashSync(req.body.password, 10);
        const result = await User.findByIdAndUpdate(req.userId, {$set: req.body}, {useFindAndModify: false}).lean();

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
        const {params: {id: productId}, body: {number}} = req;

        const user = await User.findById(req.userId).populate({path: 'buy', populate: 'nested.product'}).lean();
        const product = await Product.findById(productId).lean();
        if (!product) throw new Error('Product not for sell');
        //TODO: Upsert? -> Not too effient because not exist err
        // await BuyList.updateOne({_id: user.buy._id, 'nested.product': productId}, {$set: {'nested.$.number': number}},  {upsert: true},);

        //const list = await BuyList.findOne({_id: user.buy._id}, nested: {$elemMatch: {product: productId}}).exec();
        //if (list.nested.length == 0)

        const list = await BuyList.findOne({_id: user.buy._id, 'nested.product': productId}).lean().exec();
        if (!list) {
            await BuyList.updateOne({_id: user.buy._id}, {$push: {nested: {product: productId, number}}});
        }
        else await BuyList.updateOne({_id: user.buy._id, 'nested.product': productId}, {$inc: {'nested.$.number': number}});
        res.status(200).send(user.buy.nested);
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }

};

exports.delete = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate({path: 'buy', populate: 'nested.product'}).lean();
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
        const user = await User.findById(req.userId).populate({path: 'buy', populate: 'nested.product'}).lean();
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

        if (pos !== -1) {
            res.status(200).send(list[pos]);
        } else throw new Error('Product not found');

        //-> all BuyList
        // const {params: {id: productId}} = req;
        // const product = await BuyList.findOne({_id: user.buy._id, 'nested.product': productId}).lean();
        // res.status(200).send(product);
    } catch (e) {
        const message = e.message;
        return res.status(500).send(message);
    }
};

exports.getProducts = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
                               .populate({path: 'buy', populate: {path: 'nested.product'}}).lean();
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
        else {
            user.money -= sum;
            await BuyList.updateOne({_id: user.buy._id}, {$set: {nested: []}});

            user.save();
            res.status(200).send(user);
        }
    } catch (e) {
        const message = e.message;
        //console.log(e);
        return res.status(500).send(message);
    }
};