let User = require('../models/User.model');

exports.update = async (req, res) => {
    try {
        const result = await User.findByIdAndUpdate(req.params.id, {$set: req.body});
        res.send(result);
    } catch(err){
        console.log(err);
        res.status(404).send('Listing Error');
    }
};

exports.detail = async (req, res) => {
    try {
        const result= await User.findById(req.userId, {password: 0});
        res.status(200).send(result);
    } catch (e) {
        res.status(404).send('No User found');
        console.log(e);
    }
};

exports.logOut = async (req, res) => {
    await res.clearCookie('token');
    res.redirect('/home');
};

exports.buy = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('buy').exec();
        user.buy.markModified('nested');
        user.buy.nested.push({product: req.params.id, number: req.body.number});
        user.buy.save();
        res.json(user.buy.nested);
    }catch (e) {
        console.log(e);
        return res.status(500).send('Buying false');
    }

};

exports.delete = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('buy').exec();
        const pos = await user.buy.nested.findIndex(element => element.product == req.body.id);
        if (pos != -1) {
            user.buy.nested.splice(pos, 1);
            user.buy.save();
            res.json(user.buy.nested);
        } else res.status(500).send('Product not found');
    } catch (e) {
        console.log(err);
        return res.status(500).send('Deleting false');
    }
};

exports.update = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('buy').exec();
        const pos = await user.buy.nested.findIndex(element => element.product == req.body.id);
        if (pos != -1) {
            user.buy.nested[pos].number = req.body.number;
            user.buy.save();
            res.json(user.buy.nested);
        } else res.status(500).send('Product not found');
    } catch (e) {
        console.log(e);
        return res.status(500).send('Updating false');
    }
};

exports.getSingleProduct = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('buy').exec();
        res.json(user);
    } catch (e) {
        console.log(e);
        return res.status(500).send('Listing product false');
    }
};