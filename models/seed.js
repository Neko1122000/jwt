const User = require('../models/User.model');
const buyList = require('../models/buyList.model');
const bcrypt = require('bcryptjs');

let buylist = new buyList();

buyList.create(buylist);

let newUser = new User({
    name: 'phuong',
    email: 'admin@gmail.com',
    password: bcrypt.hashSync('admin', 10),
    role: 'admin',
    buy: buylist._id,
});

User.create(newUser)
    .then(function () {
    })
    .catch(err => {
        console.log(err);
    });