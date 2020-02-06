
const productActions = require('../actions/ProductActions');

exports.test = function(req, res){
    res.send("Testing");
};

exports.create = async (req, res) => {
    try {
        const product = await productActions.create(req.body);
        res.status(200).send(product);
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
};

exports.getSingleProduct = async (req, res) => {
    try {
        const {params: {id: productId}} = req;
        const product = await productActions.getSingleProduct(productId);
        res.status(200).send(product);
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
};

exports.update = async (req, res) => {
    try {
        const {params: {id: productId}, body: data} = req;
        productActions.update(productId, data);
        res.status(200).send("Successfully Update");
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
};

exports.delete = async (req, res) => {
    try {
        const {params: {id: productId}} = req;
        productActions.delete(productId);
        res.status(200).send("Successfully Deleting");
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
};

exports.getProducts = async (req, res) => {
    try {
        const result = await productActions.getProducts(res.query);
        res.status(200).send(result);
    } catch(e) {
        const message = e.message;
        res.status(500).send(message);
    }
};

exports.checkout = async (req, res) => {
    try {
        //const {params: {id: data.product_id}, body: {data.quantity}, userId: data.user_id} = req;
        const data = {
            product_id: req.params.id,
            quantity : req.body.quantity,
            user_id: req.userId,
        };
        const newOrder = await productActions.checkout(data);
        res.status(200).send(newOrder);
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }

};
