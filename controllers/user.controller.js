const User = require('../models/User.model');
const Order = require('../models/order.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.getUsers = async (req, res) => {
    try {
        const {params: {limit: perPage, page: N}} = req;

        const result = await User.find({})
            .select({hash_password: 0})
            .skip(N*perPage)
            .limit(perPage)
            .sort({name: 1});
        res.status(200).send(result);
    } catch (e) {
        console.log(e);
        res.status(404).send('Listing Error');
    }
};

exports.register = async (req, res) => {
    try {
        const {name: name, email: email, password: password} = req.body;
        const hashPassword = bcrypt.hashSync(password, 10);

        let newUser = new User({
            name: name,
            email: email,
            hash_password: hashPassword,
        });
        await newUser.save();
        const token = await jwt.sign({id: newUser._id}, config.secret, {expiresIn: 84600});

        console.log(token);
        res.status(200).send(token);
    } catch (e) {
        console.log(e);
    }
};

exports.delete = async (req, res) => {
    try {
        const userId = req.params.id;
        await User.findByIdAndDelete(userId);
        res.status(200).send('Successfully delete');
    } catch(err){
        console.log(err);
    }
};

exports.login = async (req, res) => {
    try {
        const result = await User.findOne({email: req.body.email});
        const {body: {password: password}} = req;
        if (!result) return res.status(404).send('Email / password not correct');

        const verify = await bcrypt.compareSync(password, result.hash_password);
        if (!verify) return res.status(401).send('Email / password not correct');
        const token = await jwt.sign({id: result._id}, config.secret, {expiresIn: 86400});

        res.status(200).send(token);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error login');
    }
};

exports.getSingleUser = async (req, res) => {
    try {
        const result = await User.findById(req.userId)
                                 .select({hash_password: 0}).lean();
        res.status(200).send(result);
        console.log(req.userId);
    } catch (e) {
        const message = e.message;
        res.status(404).send(message);
    }
};

exports.update = async (req, res) => {
    try {
        const {userId: userId, body: data} = req;
        const result = await User.findByIdAndUpdate(userId, {$set: data}, {useFindAndModify: false, new: true}).lean();

        res.status(200).send(result);
    } catch (err) {
        //console.log(err);
        const message = err.message;
        res.status(500).send(message);
    }
};

exports.changePassword = async (req, res) => {
    const {body: {old_password: oldPassword, new_password: newPassword}, userId: userId} = req;

    const user = await User.findById(userId);
    const verify = bcrypt.compareSync(oldPassword, user.hash_password);
    if (!verify) return res.status(200).send("Password don't match");

    const new_hash_password = bcrypt.hashSync(newPassword, 10);
    await user.markModified('hash_password');
    user.hash_password = new_hash_password;
    user.save();
    res.status(200).send(user);
};

exports.getSingleOrder = async (req, res) => {
    try {
        const {params: {id: id}, userId: userId} = req;
        const product = await Order.findOne({_id: id, user_id: userId});
        res.status(200).send(product);
    } catch (e) {
        const message = e.message;
        return res.status(500).send(message);
    }
};

exports.getOrders = async (req, res) => {
    try {
        const {params: {limit: perPage, page: N}, userId: userId} = req;
        const list = await Order.find({user_id: userId})
                                  .skip(N*perPage)
                                  .limit(perPage)
                                  .sort({created_at: 1});
        res.status(200).send(list);
    } catch (e) {
        const message = e.message;
        return res.status(500).send(message);
    }
};

