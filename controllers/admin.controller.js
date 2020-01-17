let User = require('../models/User.model');

exports.detail = async (req, res) => {
    //console.log(req.userId);
    try {
        const result = await User.findById(req.userId, {password: 0})
        if (!result) return res.status(404).send('No User found');
        res.status(200).send(result);
    }
    catch(err) {
        console.log(err);
        res.status(500).send('Error');
    }
    //res.send('not ok');
}

exports.delete_user = async (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(() => {
            res.send('Successfully delete');
        }).catch(err => {
        console.log(err);
    })
}