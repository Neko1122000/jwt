const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const buyList = require('../models/buyList.model');

exports.list = async (req, res) => {
    try {
        const result = await User.find({}, {password: 0}).sort({name: 1}).exec();
        res.send(result);
    } catch (e) {
        console.log(e);
        res.status(404).send('Listing Error');
    }
};

exports.create = async (req, res) => {
    try {
        const hashPassword = bcrypt.hashSync(req.body.password, 10);
        const buy =  await buyList.create();

        let newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword,
            buy: buy._id,
        });
        await User.save(newUser);
        const  token = await jwt.sign({id: newUser._id, role: newUser.role}, config.secret, {expiresIn: 84600});
        res.cookie('token', token, {expiresIn: 86400});
        res.redirect('/user/profile');
    }catch (e) {
        console.log(err);
    }
};

exports.signIn = async (req, res) => {
    try {
        const result = await User.findOne({email: req.body.email});
        if (!result) return res.status(404).send('No User found');

        const verify = await bcrypt.compareSync(req.body.password, result.password);
        if (!verify) return res.status(401).send('Email/password not correct');
        const token = await jwt.sign({id: result._id, role: result.role}, config.secret, {expiresIn: 86400});

        res.cookie('token', token);
        res.redirect('/user/profile');
    } catch(err) {
        console.log(err);
        res.status(500).send('Error login');
    }

};