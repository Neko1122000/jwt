const User = require('../models/User.model');
const Order = require('../models/order.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.getUsers = async (req, res) => {
    try {
        const {limit: lim, page: pag, sort_by: sortType} = req.query;
        const limit = lim? parseInt(lim): 2;
        const page = pag? parseInt(pag): 1;

        const result = await User.find()
            .select({hash_password: 0})
            .skip((page-1)*limit)
            .limit(limit)
            .sort(sortType);
        res.status(200).send(result);
    } catch (e) {
        console.log(e);
        res.status(404).send('Listing Error');
    }
};

exports.register = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const hashPassword = bcrypt.hashSync(password, 10);

        let newUser = User.create({
            name,
            email,
            hash_password: hashPassword,
        });
        const token = await jwt.sign({id: newUser._id}, config.secret, {expiresIn: 84600});

        //console.log(token);
        res.status(200).send(token);
    } catch (e) {
        console.log(e);
    }
};

exports.delete = async (req, res) => {
    try {
        const userId = req.params.id;
        User.deleteOne({_id: userId});
        res.status(200).send('Successfully delete');
    } catch(err){
        console.log(err);
    }
};

exports.login = async (req, res) => {
    try {
        const {body: {password, email}} = req;
        const result = await User.findOne({email: email});
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
    } catch (e) {
        const message = e.message;
        res.status(404).send(message);
    }
};

exports.update = async (req, res) => {
    try {
        const {userId: userId, body: data} = req;
        User.updateOne(userId, {$set: data}, {new: true}).lean();

        res.status(200).send('update successfully');
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

    const newHashPassword = bcrypt.hashSync(newPassword, 10);

    User.updateOne({_id: userId}, {$set: {hash_password: newHashPassword}});

    res.status(200).send("user updated");
};

exports.getSingleOrder = async (req, res) => {
    try {
        const {params: {id}, userId} = req;
        const product = await Order.findOne({_id: id, user_id: userId});
        res.status(200).send(product);
    } catch (e) {
        const message = e.message;
        return res.status(500).send(message);
    }
};

exports.getOrders = async (req, res) => {
    try {
        const {query: {limit: lim, page: pag, sort_by: sortType}, userId: userId} = req;
        const limit = lim? parseInt(lim): 2;
        const page = pag? parseInt(pag): 1;

        const list = await Order.find({user_id: userId})
                                  .skip((page-1)*limit)
                                  .limit(limit)
                                  .sort(sortType);
        res.status(200).send(list);
    } catch (e) {
        const message = e.message;
        return res.status(500).send(message);
    }
};

//TODO: page, limit parse from String?

