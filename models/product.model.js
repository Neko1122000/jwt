const mongoose = require('mongoose');

let Product = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    price: {type: Number, required: true},
});

module.exports = mongoose.model('product', Product);