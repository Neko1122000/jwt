const Product = require('../models/product.model');

exports.test = function(req, res){
    res.send("Testing");
};

exports.create = async (req, res) => {
    let product = new Product({
        name: req.body.name,
        price: req.body.price
    });

    product.save(function(err) {
        if (err) {
            console.log(err);
        } else res.send("Successful buying");
    });
};

exports.getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.send(product);
    } catch (e) {
        console.log(e);
    }
};

exports.update = async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, {$set: req.body});
        res.send("Successfully Update");
    } catch (e) {
        console.log(e);
    }
};

exports.delete = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id, {$set: req.body});
        res.send("Successfully Deleting");
    } catch (e) {
        console.log(e);
    }
};

exports.getProducts = async (req, res) => {
    try {
        const element = await Product.find();
        res.json(element);
    } catch(err) {
        console.log(err);
    }
};
