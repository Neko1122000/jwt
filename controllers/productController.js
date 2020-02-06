const Product = require('../models/Product');
const Orders = require('../models/Order');
const parse = require('../helpers/getNumber')

exports.test = function(req, res){
    res.send("Testing");
};

exports.create = async (req, res) => {
    try {
        const {body: {name, price}} = req;
        let product = await Product.create({
            name,
            price,
        });
        res.status(200).send(product);
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
};

exports.getSingleProduct = async (req, res) => {
    try {
        const {params: {id: productId}} = req;
        const product = await Product.findById(productId).lean();
        res.status(200).send(product);
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
};

exports.update = async (req, res) => {
    try {
        const {params: {id: productId}, body: data} = req;
         Product.updateOne({_id: productId}, {$set: data}).lean();
        res.status(200).send("Successfully Update");
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
};

exports.delete = async (req, res) => {
    try {
        const {params: {id: productId}} = req;
        Product.deleteOne({_id: productId});
        res.status(200).send("Successfully Deleting");
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
};

exports.getProducts = async (req, res) => {
    try {
        const {limit: lim, page: pag, sort_by: sortType} = req.query;
        // const limit = lim? parseInt(lim): 2;
        // const page = pag? parseInt(pag): 1;

        const page = parse.getNumberIfPossitive(pag) || 1;
        const limit = parse.getNumberIfPossitive(lim) || 10;

        const result = await Product.find({})
                                    .skip((page-1)*limit)
                                    .limit(limit)
                                    .sort(sortType);
        res.status(200).send(result);
    } catch(e) {
        const message = e.message;
        res.status(500).send(message);
    }
};

exports.checkout = async (req, res) => {
    try {
        const {params: {id: productId}, body: {quantity}, userId: userId} = req;

        if (quantity <= 0) throw new Error('Quantity must be larger than 0');

        const newProduct = await Orders.create({
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
