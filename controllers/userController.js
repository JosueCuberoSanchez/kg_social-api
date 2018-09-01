/**
 * User controller
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

require('../models/User');
require('../models/AccountVerification');
const User = mongoose.model('users');
const AccountVerification = mongoose.model('accountVerifications');
const EmailData = require('../private/email-data');

// Email sending
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: EmailData.email,
        pass: EmailData.password
    }
});

let mailOptions = {
    from: '"KG Social" <jo96cube@gmail.com>', // sender address
    to: '', // list of receivers
    subject: 'KG Social account verification', // Subject line
    html: '', // plaintext body
};

const uuidv1 = require('uuid/v1');

// JSON response utility function
const respond = function(res, status, content) {
    res.status(status);
    res.json(content);
};

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
                console.log('login password:' + req.body.password);
                bcrypt.hash(req.body.password, 10, function (err, hash){
                    if (err) {
                        return next(err);
                    }
                    console.log('login hash:' + hash);
                });
                bcrypt.compare(req.body.password, user.password, function (err, result) {
                    if (result) {
                        if(user.active) {
                            respond(res, 200, {
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                points: user.points,
                                username: user.username,
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
            next(e) // do not let the server hanging
        }
    }
}

async function signup(req, res, next) {
    if (!req.body.email || !req.body.username || !req.body.password || !req.body.lastName || !req.body.firstName) {
        respond(res, 400, 'The request is missing some data');
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
                const userBody = {
                    email: req.body.email,
                    username: req.body.username,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    password: hashedPassword
                }
                const user = new User(userBody);
                await user.save();

                const code = uuidv1();
                const accountVerification = new AccountVerification({
                    code: code,
                    user: user._id
                });
                accountVerification.save();

                mailOptions.to = req.body.email;
                mailOptions.html = `<p>Hello ${req.body.firstName} ${req.body.lastName}, 
                please click on the following link to verify your account:</p> 
                <a href="http://localhost:8080/verify/${code}">Verify account</a>`;
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                });

                respond(res, 201, {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    points: user.points,
                    username: user.username,
                    id: user._id
                });
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