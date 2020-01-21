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
        res.status(400).send(e);
    }
};

exports.getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).send(product);
    } catch (e) {
        res.status(400).send(e);
    }
};

exports.update = async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, {$set: req.body});
        res.status(200).send("Successfully Update");
    } catch (e) {
        res.status(400).send(e);
    }
};

exports.delete = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).send("Successfully Deleting");
    } catch (e) {
        res.status(400).send(e);
    }
};

exports.getProducts = async (req, res) => {
    try {
        const element = await Product.find();
        res.status(200).send(element);
    } catch(e) {
        res.status(400).send(e);
    }
};
