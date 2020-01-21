const jwt = require('jsonwebtoken');
const config = require('../config/config');
const cookies = require('cookie');

exports.authencate = async (req, res, next) => {
    /*if (!req.headers.cookie) return res.status(401).send({ auth: false, message: 'No token provided.' });
    const cookie = cookies.parse(req.headers.cookie);
    if (!cookie.token) return res.status(401).send({ auth: false, message: 'No token provided.' });*/

    const token = req.get('Authorization').substring(7);
    console.log(req.get('Authorization'));
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        req.userId = decoded.id;
        next();
    });
};
