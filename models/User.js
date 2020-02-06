const mongoose = require('mongoose');

const User = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    hash_password: {type: String, required: true},
    email: {type: String, required: true, unique: true, trim: true},
    role: {type: String, enum: ['admin', 'user'], default: 'user'},
});

module.exports = mongoose.model('User', User);