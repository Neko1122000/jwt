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
        const product = await Product.findById(req.params.id).lean();
        res.status(200).send(product);
    } catch (e) {
        const message = e.message
        res.status(500).send(message);
    }
};

exports.update = async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, {$set: req.body}).lean();
        res.status(200).send("Successfully Update");
    } catch (e) {
        const message = e.message
        res.status(500).send(message);
    }
};

exports.delete = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).send("Successfully Deleting");
    } catch (e) {
        const message = e.message
        res.status(500).send(message);
    }
};

exports.getProducts = async (req, res) => {
    try {
        const element = await Product.find().lean();
        res.status(200).send(element);
    } catch(e) {
        const message = e.message
        res.status(500).send(message);
    }
};
