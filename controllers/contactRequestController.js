/**
 * Event controller
 */
const mongoose = require('mongoose');

//Models
require('../models/ContactRequest');
require('../models/User');
const ContactRequest = mongoose.model('contactRequests');
const User = mongoose.model('users');

// Helpers
const EmailSender = require('../helpers/functions');

// JSON response utility function
const respond = function(res, status, content) {
    res.status(status);
    res.json(content);
};

async function createContactRequest(req, res, next) {
    try {
        if (!req.body) {
            respond(res, 400, 'The request is missing some data');
            next();
        }
        
        // Create verification
        const contactRequest = new ContactRequest(req.body);
        contactRequest.save();

        const user = await User.findOne({_id: contactRequest.user});

        // Send email
        EmailSender.sendContactRequestEmails(user.firstName, user.email, contactRequest.title, contactRequest.description);

        // Respond
        respond(res, 200, 'Contact request submitted');
        next();
    } catch (e) {
        console.log('Error :', e);
        next(e);
    }
}

module.exports = { createContactRequest };
