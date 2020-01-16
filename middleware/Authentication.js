const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/config');

exports.authencate = function (req, res, next) {
    if (!req.headers.cookie) return res.status(401).send({ auth: false, message: 'No token provided.' });
    let token = req.headers.cookie.substring(6);
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        req.userId = decoded.id;
        next();
    });
}
