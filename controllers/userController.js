/**
 * User controller
 */
const mongoose = require('mongoose');

// Models
require('../models/User');
require('../models/AccountVerification');
const User = mongoose.model('users');
const AccountVerification = mongoose.model('accountVerifications');

// Helpers
const EmailSender = require('../helpers/functions');
const bcrypt = require('bcryptjs');

// Unique ID generator
const uuidv1 = require('uuid/v1');

// JSON response utility function
const respond = function(res, status, content) {
    res.status(status);
    res.json(content);
};

/**
 * Checks if the user trying to log in is valid.
 */
async function login(req, res, next) {
    if (!req.body.email || !req.body.password) {
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
                    if (result) {
                        if(user.active) {
                            respond(res, 200, {email: user.email, firstName: user.firstName,
                                lastName: user.lastName, phone: user.phone,
                                points: user.points, username: user.username,
                                facebook: user.facebook, twitter: user.twitter,
                                instagram: user.instagram, image: user.image,
                                id: user._id
                            });
                        } else {
                            respond(res, 401, 'Unauthorized');
                        }
                    } else {
                        respond(res, 400, 'Bad credentials');
                    }
                    next();
                });
            }
        } catch (e) {
            console.log('Error :', e);
            next(e);
        }
    }
}

/**
 * Logs out the current user.
 */
async function logout(req, res, next) {
    if (req.session) {
        req.session.destroy(function(err) {
            if(err) {
                return next(err);
            }
        });
    }
    respond(res, 200);
    next();
}

/**
 * Create a user.
 */
async function createUser(req, res, next) {
    if (!req.body.email || !req.body.username || !req.body.password || !req.body.lastName || !req.body.firstName) {
        respond(res, 400, 'The request to create a user is missing some data');
        next();
    } else {
        const user = await User.findOne({email: req.body.email});
        if (user) {
            respond(res, 409, 'That email is already registered in the system');
            next();
        } else {
            try {
                const hashedPassword = await new Promise((resolve, reject) => {
                    bcrypt.hash(req.body.password, 10, function(err, hash) {
                      if (err) reject(err)
                      resolve(hash)
                    });
                });
                const user = new User({
                    email: req.body.email,
                    username: req.body.username,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    password: hashedPassword
                });
                await user.save();

                const code = uuidv1();
                const accountVerification = new AccountVerification({
                    code: code,
                    user: user._id
                });
                accountVerification.save();

                EmailSender.sendAccountVerificationEmail(user.firstName, user.email, code)

                respond(res, 201, 'User created');
                next();
            } catch (e) {
                console.log('Error :', e);
                next(e);
            }
        }
    }
}

async function updateUser(req, res, next) {
    if (!req.body.values || !req.body.id) {
        respond(res, 400, 'The request is missing some data');
        next();
    } else {
        try {
            let user = await User.findByIdAndUpdate(req.body.id, req.body.values).exec();
            user = await User.findOne({_id: req.body.id});
            if (!user) {
                respond(res, 404, 'User not found');
                next();
            } else {
                respond(res, 200, {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    points: user.points,
                    username: user.username,
                    facebook: user.facebook,
                    twitter: user.twitter,
                    instagram: user.instagram,
                    image: user.image,
                    id: user._id
                });
                next();
            }
        } catch (e) {
            console.log('Error :', e);
            next(e) // do not let the server hanging
        }
    }
}

async function getUser(req, res, next) {
    if (!req.query.username) {
        respond(res, 400, 'The request is missing some data');
        next();
    } else {
        try {
            const user = await User.findOne({username: req.query.username});
            if (!user) {
                respond(res, 404, 'User not found');
                next();
            } else {
                respond(res, 200, {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    points: user.points,
                    username: user.username,
                    facebook: user.facebook,
                    twitter: user.twitter,
                    instagram: user.instagram,
                    image: user.image,
                    id: user._id
                });
                next();
            }
        } catch (e) {
            console.log('Error :', e);
            next(e) // do not let the server hanging
        }
    }
}

module.exports = { login, logout, createUser, updateUser, getUser };