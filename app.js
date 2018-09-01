// App provides me the API router

const express = require('express');
const app = express();
const apiRouter = require('./routes/index');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const uuid = require('uuid/v4');

// function that sets headers to enable cors
enableCORS = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
};

// Middleware
app.use(enableCORS);
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
    genid: (req) => {
        return uuid()
    },
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use('/api/', apiRouter);

module.exports = app;
