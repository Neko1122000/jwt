const Product = require('../models/product.model');
const mongoose = require('mongoose');

const buyList = new mongoose.Schema({
    nested: [{
        number: {type: Number, min: 0},
        product: {type: mongoose.Schema.Types.ObjectId, ref: Product},
    }],
});

module.exports = mongoose.model('buyList', buyList);