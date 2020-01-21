const mongoose = require('mongoose');
const buyList = require('../models/buyList.model');

const User = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true, trim: true},
    buy: {type: mongoose.Schema.Types.ObjectId, ref: buyList},
    role: {type: String, enum: ['admin', 'user'], default: 'user'},
    money: {type: Number, min: 0},
});

module.exports = mongoose.model('User', User);