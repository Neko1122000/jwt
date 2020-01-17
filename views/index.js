const mongoose = require('mongoose');
const express = require('express');
const bodyparser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/mydb', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();

const port = 8080;

//require('../models/seed');

app.use( bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

const router = require('../routes/user.router');
app.use('/', router);

app.listen(port, () => {
    console.log('Listening port ' + port);
})

//TODO: Use arrow function - done
//TODO: async, await - done
//TODO: Edit router - done
// https://www.npmjs.com/package/cookie