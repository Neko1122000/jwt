const User = require('../models/User.model');

exports.verify = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) throw new Error('Not found');
        //console.log(user);
        if (user.role != 'admin') throw new Error('Not Authorized');
        next();
    } catch (e) {
        const message = e.message;
        res.status(401).send(message);
    }
};