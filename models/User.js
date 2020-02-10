const mongoose = require('mongoose');

const User = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    hash_password: {type: String, required: true},
    email: {type: String, required: true, unique: true, trim: true},
    role: {type: String, enum: ['admin', 'user'], default: 'user'},
    create_at: {type: Date, default: Date.now()},
    update_at: {type: Date, default: Date.now()},
});

User.methods.getUserInfo = async function() {
    return({
        name: this.name,
        email: this.email,
        role: this.role,
        create_at: this.create_at,
        update_at: this.update_at,
    });
};

module.exports = mongoose.model('User', User);