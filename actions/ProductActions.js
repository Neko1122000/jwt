const Product = require('../models/Product');
const parse = require('../helpers/getNumber');
const Order = require('../models/Order');

exports.create = async (data) => {
    return (Product.create({
        name: data.name,
        price: data.price,
    }));
};

exports.update = async (id, data) => {
    Product.updateOne({_id: id}, {$set: data});
};

exports.delete = async (id) => {
    Product.deleteOne({_id: id});
};

exports.getSingleProduct = async (id) => {
    return (Product.findById(id).lean());
};

exports.getProducts = async (params = {}) => {
    const {limit: lim, page: pag, sort_by: sortType} = params;

    const page = await parse.getNumberIfPositive(pag) || 1;
    const limit = await parse.getNumberIfPositive(lim) || 10;

    const products = await Product.find({})
                                .select({_id: 0})
                                .skip((page-1)*limit)
                                .limit(limit)
                                .sort(sortType).lean();

    return {
        products: products,
        page: page,
        limit: limit,
        total: 1000
    };
};

exports.checkout = async (data = {}) => {
    if (data.quantity <= 0) throw new Error('Quantity must be larger than 0');
    return(Order.create(data));
};


