const User = require('../models/User.model');
const buyList = require('./order.model');
const bcrypt = require('bcryptjs');

const buylist = buyList.create();

const newUser = new User({
    name: 'phuong',
    email: 'admin@gmail.com',
    hash_password: bcrypt.hashSync('admin', 10),
    role: 'admin',
    buy: buylist._id,
});

User.create(newUser)
    .then(function () {
    })
    .catch(err => {
        console.log(err);
    });