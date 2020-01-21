const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const buyList = require('../models/buyList.model');

exports.list = async (req, res) => {
    try {
        const result = await User.find({}).select({hash_password: 0}).sort({name: 1});
        res.send(result);
    } catch (e) {
        console.log(e);
        res.status(404).send('Listing Error');
    }
};

exports.create = async (req, res) => {
    try {
        const hashPassword = bcrypt.hashSync(req.body.password, 10);
        const buy = await buyList.create({});

        let newUser = new User({
            name: req.body.name,
            email: req.body.email,
            hash_password: hashPassword,
            money: req.body.money,
            buy: buy._id,
        });
        await newUser.save();
        const token = await jwt.sign({id: newUser._id}, config.secret, {expiresIn: 84600});

        console.log(token);
        res.status(200).send('/user/profile');
    } catch (e) {
        console.log(e);
    }
};

exports.signIn = async (req, res) => {
    try {
        const result = await User.findOne({email: req.body.email});
        if (!result) return res.status(404).send('Email / password not correct');

        //console.log(result);
        const verify = await bcrypt.compareSync(req.body.password, result.hash_password);
        if (!verify) return res.status(401).send('Email / password not correct');
        const token = await jwt.sign({id: result._id}, config.secret, {expiresIn: 86400});
        // res.redirect('/user/profile');

        res.status(200).send({token});
    } catch (err) {
        console.log(err);
        res.status(500).send('Error login');
    }
};