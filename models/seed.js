const User = require('./User');
const bcrypt = require('bcryptjs');

const newUser = new User({
    name: 'phuong',
    email: 'admin@gmail.com',
    hash_password: bcrypt.hashSync('admin', 10),
    role: 'admin',
});

User.create(newUser)
    .then(function () {
    })
    .catch(err => {
        console.log(err);
    });