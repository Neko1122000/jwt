const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

exports.authenticate = async (req, res, next) => {
    try {
        const auth = req.get('Authorization');
        if (auth == null) return res.status(500).send("Not authorized");
        const token = auth.split(" ");
        if (token[0] !== 'Bearer') return res.status(500).send("Not authorized");

        jwt.verify(token[1], config.secret, async function(err, decoded) {
            if (err) {
                return res.status(500).send(err.message);
            }

            const user = await User.findById(decoded.id);
            if (!user) return res.status(200).send("User not found");
            req.userId = decoded.id;

            next();
        });
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
};

exports.isAdmin = async (req, res, next) => {
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
