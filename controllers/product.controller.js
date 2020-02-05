const Product = require('../models/product.model');
const Orders = require('../models/order.model');

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
        await Product.findByIdAndUpdate(productId, {$set: data}).lean();
        res.status(200).send("Successfully Update");
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
};

exports.delete = async (req, res) => {
    try {
        const {params: {id: productId}} = req;
        await Product.findByIdAndDelete(productId);
        res.status(200).send("Successfully Deleting");
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
};

exports.getProducts = async (req, res) => {
    try {
        const {limit: lim, page: pag} = req.query;
        const limit = lim? parseInt(lim): 2;
        const page = pag? parseInt(pag): 0;

        const result = await Product.find({})
                                    .skip(page*limit)
                                    .limit(limit)
                                    .sort({name: 1});
        res.status(200).send(result);
    } catch(e) {
        const message = e.message;
        res.status(500).send(message);
    }
};

exports.checkout = async (req, res) => {
    try {
        const {params: {id: productId}, body: {quantity: quantity}, userId: userId} = req;
        if (quantity == 0) throw new Error('Quantity must be larger than 0');
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
