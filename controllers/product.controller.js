const Product = require('../models/product.model');

exports.test = function(req, res){
    res.send("Testing");
};

exports.product_create = async function (req, res) {
    let product = new Product({
        name: req.body.product_name,
        price: req.body.price
    })

    product.save(function(err) {
        if (err) return next(err);
        res.send("Successful buying");
    })
};

exports.product_detail = function(req, res) {
    Product.findById(req.params.id, (err, product) => {
        if (err) return next(err);
        res.send(product);
    })
};

exports.product_update = function (req, res) {
    Product.findByIdAndUpdate(req.params.id, {$set: req.body}, (err, product) =>{
        if (err) return next(err);
        res.send("Successfully Update");
    })
};

exports.product_delete = function(req, res) {
    Product.findByIdAndDelete(req.params.id, (err) => {
        if (err) return next(err);
        res.send("Successfully Delete");
    })
};

exports.list = async function(req, res) {
    await Product.find().then((element) => {
        res.json(element);
    }).catch(err => console.log(err));
}
