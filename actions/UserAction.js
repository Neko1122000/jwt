const User = require('../models/User');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const parse = require('../helpers/getNumber');

exports.getUsers = async (params = {}) => {
    const {limit: lim, page: pag, sort_by: sortType} = params;

    const page = await parse.getNumberIfPositive(pag) || 1;
    const limit = await parse.getNumberIfPositive(lim) || 10;

    const users = await User.find({})
        .select({_id: 0})
        .skip((page-1)*limit)
        .limit(limit)
        .sort(sortType).lean();

    return {
        users: users,
        page: page,
        limit: limit,
        total: 1000
    };
};

exports.update = async (id, data) => {
    User.updateOne(id, {$set: data}, {new: true});
};

exports.delete = async (id) => {
    User.deleteOne({_id: id});
};

exports.getSingleUser = async (id) => {
    return (User.findById(id)
                .select({hash_password: 0})
                .lean());
};

exports.register = async (params = {}) => {
    const {name, email, password} = params;
    const hashPassword = bcrypt.hashSync(password, 10);

    let newUser = User.create({
        name,
        email,
        hash_password: hashPassword,
    });
    const token = await jwt.sign({id: newUser._id}, config.secret, {expiresIn: 84600});
    return ({
        token: token,
        user: newUser,
    });
};

exports.login = async (params = {}) => {
    const  {password, email} = params;
    const result = await User.findOne({email: email});
    if (!result) return res.status(404).send('Email / password not correct');

    const verify = bcrypt.compareSync(password, result.hash_password);
    if (!verify) return res.status(401).send('Email / password not correct');
    const token = await jwt.sign({id: result._id}, config.secret, {expiresIn: 86400});
    return ({
        token: token,
        user: result,
    })
};

exports.changePassword = async (id, password) => {
    const {old_password: oldPassword, new_password: newPassword} = password;

    const user = await User.findById(id);
    const verify = bcrypt.compareSync(oldPassword, user.hash_password);
    if (!verify) return res.status(200).send("Password don't match");

    const newHashPassword = bcrypt.hashSync(newPassword, 10);

    User.updateOne({_id: userId}, {$set: {hash_password: newHashPassword}});
};

exports.getOrders = async (id, query) => {
    const {limit: lim, page: pag, sort_by: sortType} = query;
    // const limit = lim? parseInt(lim): 2;
    // const page = pag? parseInt(pag): 1;

    const page = parse.getNumberIfPossitive(pag) || 1;
    const limit = parse.getNumberIfPossitive(lim) || 10;

    const list = await Order.find({user_id: id})
        .skip((page-1)*limit)
        .limit(limit)
        .sort(sortType);
    return ({
        orders: list,
        page: page,
        limit: limit,
        total: 1000
    });
};

exports.getSingleOrder = async (id) => {
    return (Order.findOne({_id: id}));
};