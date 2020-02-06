const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User.model');

exports.authencate = async (req, res, next) => {
    /*if (!req.headers.cookie) return res.status(401).send({ auth: false, message: 'No token provided.' });
    const cookie = cookies.parse(req.headers.cookie);
    if (!cookie.token) return res.status(401).send({ auth: false, message: 'No token provided.' });*/

    const token = req.get('Authorization').split(" ");
    if (token[0] !== 'Bearer') return res.status(500).send(err.message);
    //console.log(token);
    jwt.verify(token[1], config.secret, function(err, decoded) {
        if (err) {
            return res.status(500).send(err.message);
        }

        req.userId = decoded.id;
        next();
    });
};

exports.verify = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) throw new Error('Not found');
        //console.log(user);
        if (user.role !== 'admin') throw new Error('Not Authorized');
        next();
    } catch (e) {
        const message = e.message;
        res.status(401).send(message);
    }
};
