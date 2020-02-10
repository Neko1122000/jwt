const User = require('../models/User');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const parse = require('../helpers/getNumber');
const validateString = require('../helpers/validateString');

exports.getUsers = async (params = {}) => {
    const {limit: lim, page: pag, sort_by: sortType} = params;

    const page = await parse.getNumberIfPositive(pag) || 1;
    const limit = await parse.getNumberIfPositive(lim) || 10;

    const users = await User.find({})
        .select({_id: 0, hash_password: 0})
        .skip((page-1)*limit)
        .limit(limit)
        .sort(sortType).lean();

    return {
        users: users,
        page: page,
        limit: limit,
        total: await User.countDocuments(),
    };
};

exports.update = async (id, data) => {
    //console.log(data);
    const user = await User.findByIdAndUpdate(id, {$set: data}, {new: true, useFindAndModify: false});
    return (user.getUserInfo());
};

exports.delete = async (id) => {
    return (User.deleteOne({_id: id}));
};

exports.getSingleUser = async (id) => {
    return (User.findById(id)
                .select({hash_password: 0, _id: 0})
                .lean());
};

exports.register = async (params = {}) => {
    const {name, email, password} = params;

    const em = await validateString.validateEmail(email);
    if (!em) throw new Error ("Enter your Email");
    if (!name) throw new Error ("Enter your name");
    const user = await User.findOne({email: email});
    if (user) throw new Error("Email has already existed");
    const pass = await validateString.passwordValidate(password);
    if (!pass) throw new Error ("Password must have at least 8 characters, at most 20 character, include digits, lowercase and upperecase");

    const hashPassword = bcrypt.hashSync(password, 10);
    let newUser = await User.create({
        name,
        email,
        hash_password: hashPassword,
    });
    const token = await jwt.sign({id: newUser._id}, config.secret, {expiresIn: 84600});
    
    return ({
        token: token,
        user: await newUser.getUserInfo(),
    });
};

exports.login = async (params = {}) => {
    const  {password, email} = params;
    const result = await User.findOne({email: email});
    if (!result) throw new Error ('Email / password not correct');

    if (!password) throw new Error ("Enter password");
    const verify = bcrypt.compareSync(password, result.hash_password);
    if (!verify) throw new Error ('Email / password not correct');
    const token = await jwt.sign({id: result._id}, config.secret, {expiresIn: 86400});
    return ({
        token: token,
        user: await result.getUserInfo(),
    })
};

exports.changePassword = async (id, password) => {
    const {old_password: oldPassword, new_password: newPassword} = password;
    const pass = await validateString.passwordValidate(newPassword);
    if (!pass) throw new Error ("Password must have at least 8 characters, at most 20 character, include digits, lowercase and upperecase");
    if (oldPassword === newPassword) throw new Error("New password must be different from last password");

    const user = await User.findById(id);
    const verify = bcrypt.compareSync(oldPassword, user.hash_password);
    if (!verify) throw new Error ("Password don't match");

    const newHashPassword = bcrypt.hashSync(newPassword, 10);
    const date = await Date.now();

    await User.updateOne({_id: id}, {$set: {hash_password: newHashPassword, update_at: date}});
};

exports.getOrders = async (id, query) => {
    const {limit: lim, page: pag, sort_by: sortType} = query;

    const page = await parse.getNumberIfPositive(pag) || 1;
    const limit = await parse.getNumberIfPositive(lim) || 10;

    const list = await Order.find({user_id: id})
                            .skip((page-1)*limit)
                            .limit(limit)
                            .sort(sortType);
    return ({
        orders: list,
        page: page,
        limit: limit,
        total: await Order.countDocuments({user_id: id}),
    });
};

exports.getSingleOrder = async (id) => {
    return (Order.findOne({_id: id}));
};