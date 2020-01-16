let User = require('../models/User.model');

exports.update = function (req, res) {
    User.findByIdAndUpdate(req.params.id, {$set: req.body}, (err, result) => {
        if (err) {
            console.log(err);
            res.status(404).send('Listing Error');
        } else res.send('Successfully Update');
    });
    console.log('User updated');
}

exports.detail = async function(req, res) {
    //console.log(req.userId);
    User.findById(req.userId, {password: 0}).then(result => {
        if (!result) return res.status(404).send('No User found');
        res.status(200).send(result);
    }).catch(err => {
        console.log(err);
        res.status(500).send('Error');
    })
    //res.send('not ok');
}

exports.logout = function (req, res) {
    res.clearCookie('token');
    res.redirect('/home');
}