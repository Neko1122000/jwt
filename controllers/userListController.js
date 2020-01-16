const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.list = function (req, res) {
    User.find({}, {password: 0}).sort({name: 1}).exec((err, result) => {
        if (err) {
            console.log(err);
            res.status(404).send('Listing Error');
        } else {
            res.send(result);
        }
    })
}

exports.create = function (req, res){
    let hashPassword = bcrypt.hashSync(req.body.password, 10);
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
    })
    User.create(newUser)
        .then(async function () {
            let token = jwt.sign({id: newUser._id, role: newUser.role}, config.secret, {expiresIn: 84600});
            res.cookie('token', token, {expiresIn: 86400});
            res.redirect('/user/profile');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.signin = function(req, res){
    User.findOne({email: req.body.email}).then(async function (result) {
        if (!result) return res.status(404).send('No User found');

        var verify = bcrypt.compareSync(req.body.password, result.password);
        if (!verify) return res.status(401).send('Email/password not correct');
        let token = jwt.sign({id: result._id, role: result.role}, config.secret, {expiresIn: 86400});

        //res.setHeader('test', token);
        res.cookie('token', token);
        res.redirect('/user/profile');
    }).catch(err => {console.log(err); res.status(500).send('Error login');});

}