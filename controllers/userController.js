/**
 * User controller
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

require('../models/User');
const User = mongoose.model('users');

// JSON response utility function
const respond = function(res, status, content) {
    res.status(status);
    res.json(content);
};

async function login(req, res, next) {
    console.log('REQID');
    console.log(req.sessionID);
    if (!req.body.email || !req.body.password) {
        console.log(req.body.email);
        console.log(req.body.password);
        respond(res, 400, 'The request is missing some data');
        next();
    } else {
        try {
            const user = await User.findOne({email: req.body.email});
            if (!user) {
                respond(res, 404, 'That email is not registered in the system');
                next();
            } else {
                bcrypt.compare(req.body.password, user.password, function (err, result) {
                    if (result === true) {
                        console.log('user: ', user);
                        respond(res, 200, {user})
                    } else {
                        console.log('user: ', user);
                        respond(res, 400, 'Bad credentials')
                    }
                    next();
                });
            }
        } catch (e) {
            console.log('Error :', e);
            next(e) // do not let the server hanging
        }
    }
}

async function signup(req, res, next) {
    if (!req.body.email || !req.body.username || !req.body.password || !req.body.passwordConf
        || !req.body.lastName || !req.body.firstName || !req.body.points) {
        respond(res, 400, 'The request is missing some data');
        next();
    } else {
        const user = await User.findOne({email: req.body.email});
        if (user) {
            respond(res, 409, 'That email is already registered in the system');
            next();
        } else {
            try {
                const user = new User(req.body);
                await user.save();
                respond(res, 201, {user})
                // redirect to dashboard
            } catch (e) {
                console.log('Error :', e);
                next(e);
            }
        }
    }
}

async function logout(req, res, next) {
    if (req.session) {
        req.session.destroy(function(err) {
            if(err) {
                return next(err);
            }
        });
    }
    respond(res, 200)
}

module.exports = { login, signup, logout };