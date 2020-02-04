const User = require('../models/User.model');

exports.detail = async (req, res) => {
    //console.log(req.userId);
    try {
        const result = await User.findById(req.userId)
                                 .select({password: 0});
        if (!result) throw new Error('No User found');
        res.status(200).send(result);
    } catch (err) {
        const message = err.message;
        res.status(500).send(message);
    }
    //res.send('not ok');
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        await User.findByIdAndDelete(userId);
        res.status(200).send('Successfully delete');
    } catch(err){
        console.log(err);
    }
};