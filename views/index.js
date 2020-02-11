const mongoose = require('mongoose');
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const https = require('http');
const logger = require('morgan');

mongoose.connect('mongodb://localhost:27017/mydb', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();

const port = 8080;

//require('../models/seed.test');
app.use(cors());
app.enable('trust-proxy');
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
app.use(logger('dev'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
});

const router = require('../routes/router');
app.use('/', router);

const server = https.createServer(app);
server.listen(port, () => {
    console.log("Listen at port: " + port);
});
