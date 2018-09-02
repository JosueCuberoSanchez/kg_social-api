/**
 * Event controller
 */
const mongoose = require('mongoose');

//Models
require('../models/PasswordVerification');
require('../models/User');
const PasswordVerification = mongoose.model('passwordVerifications');
const User = mongoose.model('users');

// Unique ID generator
const uuidv1 = require('uuid/v1');

// Helpers
const EmailSender = require('../helpers/functions');
const Constants = require('../helpers/constants');
const bcrypt = require('bcrypt');

// JSON response utility function
const respond = function(res, status, content) {
    res.status(status);
    res.json(content);
};

async function forgotPassword(req, res, next) {
    try {
        if (!req.body.email) {
            respond(res, 400, 'The request is missing some data');
            next();
        }
        const user = await User.findOne({email:req.body.email});
        if(!user) {
            respond(res, 404, 'User not found');
            next();
        }
        
        // Create verification
        const code = uuidv1();
        const passwordVerification = new PasswordVerification({
            code: code,
            user: user._id
        });
        passwordVerification.save();

        // Send email
        EmailSender.sendEmail(null, null, req.body.email, code, Constants.FORGOT_PASSWORD);

        // Respond
        respond(res, 200, 'Forgot password request created');
        next();
    } catch (e) {
        console.log('Error :', e);
        next(e);
    }
}

async function verifyCode(req, res, next) {
    try {
        if (!req.query.code) {
            respond(res, 400, 'The request is missing some data');
            next();
        }
        const verification = await PasswordVerification.findOne({code:req.query.code}); // get verification
        if(!verification) {
            respond(res, 404, 'Verification not found');
            next();
        }
        const user = await User.findOne({_id:verification.user});
        if(!user){
            respond(res, 404, 'User not found');
        } else {
            respond(res, 200, 'Valid token');
        }
        next();
    } catch (e) {
        console.log('Error :', e);
        next(e);
    }
}

async function resetPassword(req, res, next) {
    try {
        if (!req.body.code || !req.body.password) {
            respond(res, 400, 'The request is missing some data');
            next();
        }
        const verification = await PasswordVerification.findOne({code:req.body.code}); // get verification
        if(!verification) {
            respond(res, 404, 'Verification not found');
            next();
        }
        const user = await User.findOne({_id:verification.user});
        if(!user){
            respond(res, 404, 'User not found');
            next();
        }

        // Delete verification
        PasswordVerification.remove({code:req.body.code}).exec();

        // Reset password
        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(req.body.password, 10, function(err, hash) {
                if (err) reject(err)
                resolve(hash)
            });
        });
        user.password = hashedPassword;
        user.save();

        // Respond
        respond(res, 200, 'Password reseted');
    } catch (e) {
        console.log('Error :', e);
        next(e);
    }
}

module.exports = { forgotPassword, verifyCode, resetPassword };
