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

    if (users) {
        return {
            users: users,
            page: page,
            limit: limit,
            total: await User.countDocuments(),
        }
    } else return null;
};

exports.update = async (id, data) => {
    return (User.findByIdAndUpdate(id, {$set: data}, {new: true, useFindAndModify: false}));
};

exports.delete = async (id) => {
    return (User.deleteOne({_id: id}));
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
    if (!result) throw new Error ('Email / password not correct');

    const verify = bcrypt.compareSync(password, result.hash_password);
    if (!verify) throw new Error ('Email / password not correct');
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
    if (!verify) throw new Error ("Password don't match");

    const newHashPassword = bcrypt.hashSync(newPassword, 10);

    User.updateOne({_id: id}, {$set: {hash_password: newHashPassword}});
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
    if (list) {
        return ({
            orders: list,
            page: page,
            limit: limit,
            total: await Order.countDocuments(),
        });
    } else return null;
};

exports.getSingleOrder = async (id) => {
    return (Order.findOne({_id: id}));
};