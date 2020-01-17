const User = require('../models/User.model');

exports.verify = function(req, res, next){
    User.findById(req.userId).then(user => {
        if (!user) return res.status(404).send('User not found');
        if (user.role != 'admin') return res.status(401).send('Not authorized');
        next();
    }).catch(err => {
        console.log(err);
        res.status(500).send('Admin verify err');
    })
};