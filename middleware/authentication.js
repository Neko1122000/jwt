const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

exports.authencate = async (req, res, next) => {
    /*if (!req.headers.cookie) return res.status(401).send({ auth: false, message: 'No token provided.' });
    const cookie = cookies.parse(req.headers.cookie);
    if (!cookie.token) return res.status(401).send({ auth: false, message: 'No token provided.' });*/

    const auth = req.get('Authorization');
    //console.log(auth);
    if (auth == null) return res.status(500).send("Not authorized");
    const token = auth.split(" ");
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
        if (!user)  return res.status(500).send("Not authorized");
        //console.log(user);
        if (user.role !== 'admin')  return res.status(500).send("Not authorized");
        next();
    } catch (e) {
        const message = e.message;
        res.status(401).send(message);
    }
};
