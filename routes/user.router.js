const express = require('express');
const router = express.Router();
const userListController = require('../controllers/userListController');
const action = require('../routes/action.router');

router.post('/signup', userListController.create);
router.post('/signin', userListController.signin);
router.get('/list', userListController.list);

router.use('/user', action);

router.get('/home', function (req, res) {
        res.send('welcome');
})

module.exports = router;