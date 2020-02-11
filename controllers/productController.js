const productActions = require('../actions/ProductActions');

exports.test = function(req, res){
    res.json("Testing");
};

exports.create = async (req, res) => {
    try {
        const product = await productActions.create(req.body);
        res.status(200).json(product);
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
};

exports.getSingleProduct = async (req, res) => {
    try {
        const product = await productActions.getSingleProduct(req.params.id);
        res.status(200).json(product || "Product not found");
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
};

exports.update = async (req, res) => {
    try {
        const result = await productActions.update(req.params.id, req.body);
        res.status(200).json(result || "Product not found");
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
};

exports.delete = async (req, res) => {
    try {
        const result = await productActions.delete(req.params.id);
        res.status(200).json(result);
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
};

exports.getProducts = async (req, res) => {
    try {
        const result = await productActions.getProducts(res.query);
        res.status(200).json(result);
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
        res.status(200).json(newOrder);
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }

};

//TODO: 1, 2, 3, 4, 5, 6, - done 3, 2, 5, 6