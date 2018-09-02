/**
 * Event controller
 */
const mongoose = require('mongoose');

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
        } else {
            const verification = await AccountVerification.findOne({code:req.query.code}); // get verification
            if(!verification) {
                respond(res, 404, 'Verification not found');
            } else {
                const user = await User.findOne({_id:verification.user});
                if(!user){
                    respond(res, 404, 'User not found');
                } else {
                    const log = new Log({
                        action:user.username + ' has joined KG Social!',
                        date: new Date(),
                        link: 'profile/'+user.username,
                        author: user.image
                    });
                    log.save();
                    user.active = true;
                    user.save();
                    AccountVerification.remove({code:req.query.code}).exec();
                    respond(res, 200, {
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        points: user.points,
                        username: user.username,
                        id: user._id
                    });
                }
            }
        }
    } catch (e) {
        console.log('Error :', e);
        next(e);
    }
}

module.exports = { verifyCode };
