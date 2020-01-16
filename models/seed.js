const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

let newUser = new User({
    name: 'phuong',
    email: 'admin@gmail.com',
    password: bcrypt.hashSync('admin', 10),
    role: 'admin',
})

User.create(newUser)
    .then(async function () {
    })
    .catch(err => {
        console.log(err);
    })