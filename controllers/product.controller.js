const Product = require('../models/product.model');

exports.test = function(req, res){
    res.send("Testing");
};

exports.create = async (req, res) => {
    let product = new Product({
        name: req.body.name,
        price: req.body.price
    });

    try {
        await product.save();
        res.status(200).send(product);
    } catch (e) {
        const message = e.message
        res.status(500).send(message);
    }
};

exports.getSingleProduct = async (req, res) => {
    try {
        const {params: {id: productId}} = req;
        const product = await Product.findById(productId).lean();
        res.status(200).send(product);
    } catch (e) {
        const message = e.message
        res.status(500).send(message);
    }
};

exports.update = async (req, res) => {
    try {
        const {params: {id: productId}, body: data} = req;
        await Product.findByIdAndUpdate(productId, {$set: data}).lean();
        res.status(200).send("Successfully Update");
    } catch (e) {
        const message = e.message
        res.status(500).send(message);
    }
};

exports.delete = async (req, res) => {
    try {
        const {params: {id: productId}} = req;
        await Product.findByIdAndDelete(productId);
        res.status(200).send("Successfully Deleting");
    } catch (e) {
        const message = e.message
        res.status(500).send(message);
    }
};

exports.getProducts = async (req, res) => {
    try {
        const perPage = 2;
        const N = req.params.page;

        const result = await Product.find({})
                                    .skip(N*perPage)
                                    .limit(perPage)
                                    .sort({name: 1});
        res.status(200).send(result);
    } catch(e) {
        const message = e.message
        res.status(500).send(message);
    }
};
