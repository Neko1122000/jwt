let User = require('../models/User.model');

exports.update = function (req, res) {
    User.findByIdAndUpdate(req.params.id, {$set: req.body}, (err, result) => {
        if (err) {
            console.log(err);
            res.status(404).send('Listing Error');
        } else res.send('Successfully Update');
    });
    console.log('User updated');
};

exports.detail = function(req, res) {
    User.findById(req.userId, {password: 0}).then(result => {
        if (!result) return res.status(404).send('No User found');
        res.status(200).send(result);
    }).catch(err => {
        console.log(err);
        res.status(500).send('Error');
    })
};

exports.logout = function (req, res) {
    res.clearCookie('token');
    res.redirect('/home');
};

exports.buy = function (req, res) {
    User.findById(req.userId)
        .populate('buy')
        .exec((err, user) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Buying false');
            }
            user.buy.markModified('nested');
            user.buy.nested.push({product: req.body.id, number: req.body.number});
            user.buy.save();
            res.json(user.buy.nested);
        });
};

exports.delete_product = function (req, res) {
    User.findById(req.userId)
        .populate('buy')
        .exec((err, user) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Deleting false');
            }
            let pos = user.buy.nested.findIndex(element => element.product == req.body.id);
            if (pos != -1) {
                user.buy.nested.splice(pos, 1);
                user.buy.save();
                res.json(user.buy.nested);
            } else res.status(500).send('Product not found');
        });
}

exports.update_product = function (req, res) {
    User.findById(req.userId)
        .populate('buy')
        .exec((err, user) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Updating false');
            }
            let pos = user.buy.nested.findIndex(element => element.product == req.body.id);
            if (pos != -1) {
                user.buy.nested[pos].number = req.body.number;
                user.buy.save();
                res.json(user.buy.nested);
            } else res.status(500).send('Product not found');
        });
}

exports.product_detail = function (req, res) {
    User.findById(req.userId, {password: 0})
        .populate('buy')
        .exec((err, user) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Listing product false');
            }
            res.json(user);
        });
}