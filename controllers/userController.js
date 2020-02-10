const userActions = require('../actions/UserAction');

exports.getUsers = async (req, res) => {
    try {
        const result = await userActions.getUsers(req.query);
        res.status(200).send(result);
    } catch (e) {
        console.log(e);
        res.status(404).send('Listing Error');
    }
};

exports.register = async (req, res) => {
    try {
        const user = await userActions.register(req.body);
        res.status(200).send(user);
    } catch (e) {
        const message = e.message;
        res.status(500).send(message);
    }
};

exports.delete = async (req, res) => {
    try {
        const result = await userActions.delete(req.userId);
        res.status(200).send(result);
    } catch(err){
        console.log(err);
    }
};

exports.getSingleUser = async (req, res) => {
    try {
        const result = await userActions.getSingleUser(req.userId);
        res.status(200).send(result || "No User found");
    } catch (e) {
        const message = e.message;
        res.status(404).send(message);
    }
};

exports.update = async (req, res) => {
    try {
        if (req.body.hash_password || req.body.role || req.body.create_at || req.body.update_at) {
            return res.status(302).send("Change not allow");
        }
        req.body.update_at = await Date.now();
        const result = await userActions.update(req.userId, req.body);
        res.status(200).send(result || "No User found");
    } catch (err) {
        const message = err.message;
        res.status(500).send(message);
    }
};

exports.login = async (req, res) => {
    try {
        const user = await userActions.login(req.body);
        res.status(200).send(user || "No User found");
    } catch (err) {
        //console.log(err);
        const message = err.message;
        res.status(404).send(message);
    }
};

exports.changePassword = async (req, res) => {
    try {
        await userActions.changePassword(req.userId, req.body);
        res.status(200).send("password changed");
    } catch (err) {
        //console.log(err);
        const message = err.message;
        res.status(401).send(message);
    }
};

exports.getSingleOrder = async (req, res) => {
    try {
        const product = await userActions.getSingleOrder(req.params.id);
        res.status(200).send(product || "Order not found");
    } catch (e) {
        const message = e.message;
        return res.status(500).send(message);
    }
};

exports.getOrders = async (req, res) => {
    try {
        const list = await userActions.getOrders(req.userId, req.query);
        res.status(200).send(list);
    } catch (e) {
        const message = e.message;
        return res.status(500).send(message);
    }
};


