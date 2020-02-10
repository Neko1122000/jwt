const mongoose = require('mongoose');
const express = require('express');
const bodyparser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/mydb', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();

const port = 8080;

//require('../models/seed.test');
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

const router = require('../routes/router');
app.use('/', router);

app.listen(port, () => {
    console.log('Listening port ' + port);
});
