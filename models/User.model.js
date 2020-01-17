const mongoose = require('mongoose');
const buyList = require('../models/buyList.model');

let User = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true, trim: true},
    buy: {type: mongoose.Schema.Types.ObjectId, ref: buyList},
    role: {type: String, enum: ['admin', 'user'], default: 'user'},
});

module.exports = mongoose.model('User', User);