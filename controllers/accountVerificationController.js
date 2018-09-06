/**
 * Event controller
 */
const mongoose = require('mongoose');

// Models
require('../models/AccountVerification');
require('../models/User');
require('../models/Log');
const AccountVerification = mongoose.model('accountVerifications');
const User = mongoose.model('users');
const Log = mongoose.model('logs');

// JSON response utility function
const respond = function(res, status, content) {
    res.status(status);
    res.json(content);
};

async function verifyCode(req, res, next) {
    try {
        if (!req.query.code) {
            respond(res, 400, 'The request is missing some data');
            next();
        }

        const verification = await AccountVerification.findOne({code:req.query.code});

        console.log(verification);
        if(!verification) {
            respond(res, 404, 'Verification not found');
            next();
        }

        const user = await User.findOne({_id:verification.user});
        if(!user){
            respond(res, 404, 'User not found');
            next();
        }

        // Create a KG join log
        const log = new Log({
            action:user.username + ' has joined KG Social!',
            date: new Date(),
            link: 'profile/'+user.username,
            author: user._id
        });
        log.save();

        // Modify user state
        user.active = true;
        user.save();

        // Delete account verification
        AccountVerification.remove({code:req.query.code}).exec();

        // Respond
        respond(res, 200, 'User account verified');
        next();
    } catch (e) {
        console.log('Error :', e);
        next(e);
    }
}

module.exports = { verifyCode };
