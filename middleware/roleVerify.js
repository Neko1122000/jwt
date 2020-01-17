const User = require('../models/User.model');

exports.verify = async (req, res, next) => {
    try {
        const user = User.findById(req.userId);
        if (!user) return res.status(404).send('User not found');
        if (user.role != 'admin') return res.status(401).send('Not authorized');
        next();
    } catch (e) {
        console.log(e);
        res.status(500).send('Admin verify err');
    }
};