const Product = require('../models/Product');
const parse = require('../helpers/getNumber');
const Order = require('../models/Order');

exports.create = async (data) => {
    const price = await parse.getNumberIfPositive(data.price);
    if (!price) return ("Price must be number larger than 0");
    return (Product.create({data}));
};

exports.update = async (id, data) => {
    return (Product.findOneAndUpdate({_id: id}, {$set: data}, {new: true, useFindAndModify: false}));
};

exports.delete = async (id) => {
    return (Product.deleteOne({_id: id}));
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
    if (products.length > 0) {
        return {
            products: products,
            page: page,
            limit: limit,
            total: await Product.countDocuments(),
        }
    } else return null;
};

exports.checkout = async (data = {}) => {
    const quantity = await parse.getNumberIfPositive(data.quantity);
    if (!quantity) return ('Quantity must be larger than 0');
    const product = await Product.findById(data.product_id);
    if (product == null) return ('Product not found');
    return(Order.create(data));
};


