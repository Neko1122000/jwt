const Product = require('../models/product.model');
const User = require('../models/User.model');
const mongoose = require('mongoose');

const Order = new mongoose.Schema({
    product_id: {type: mongoose.Schema.Types.ObjectId, ref: Product},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: User, index: true},
    quantity: {type: Number, min: 0},
    created_at: {type: Date, default: Date.now()},
});

module.exports = mongoose.model('Order', Order);