let User = require('../models/User.model');
const Product = require('../models/product.model');

exports.detail = async (req, res) => {
    try {
        const result= await User.findById(req.userId, {password: 0});
        res.status(200).send(result);
    } catch (e) {
        res.status(404).send('No User found');
        console.log(e);
    }
};

exports.userUpdate = async (req, res) => {
    try {
        const result = await User.findByIdAndUpdate(req.userId, {$set: req.body});
        result.save();
        res.send(result);
    } catch(err){
        console.log(err);
        res.status(404).send('Listing Error');
    }
};

exports.logOut = async (req, res) => {
    await res.clearCookie('token');
    res.redirect('/home');
};

exports.buy = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('buy').exec();
        const product = await Product.findById(req.params.id).exec();
        if (!product) return res.status(400).send('Product not for sell');
        user.buy.markModified('nested', 'money');
        user.buy.nested.push({product: req.params.id, number: req.body.number});
        user.buy.save();
        //user.save();
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

exports.purchase = async (req, res) => {
    try{
        const user = await User.findById(req.userId).populate('buy').exec();
        let sum = 0;
        for (let i = 0; i < user.buy.nested.length; ++i) {
            let element = user.buy.nested[i];
            let product = await Product.findById(element.product).exec();
            sum += product.price*element.number;
        }
        if (sum > user.money) return res.send('Not enough to purchase');
        user.markModified('money');
        user.money -= sum;
        user.buy.nested.length = 0;
        user.save();
        res.send(user);
    } catch (e) {
        console.log(e);
    }
};