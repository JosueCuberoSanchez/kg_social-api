/**
 * Event controller
 */
const mongoose = require('mongoose');

// Models
require('../models/Event');
require('../models/User');
require('../models/Comment');
require('../models/Log');
const Event = mongoose.model('events');
const User = mongoose.model('users');
const Comment = mongoose.model('comments');
const Log = mongoose.model('logs');

// JSON response utility function
const respond = function(res, status, content) {
    res.status(status);
    res.json(content);
};

async function createComment(req, res, next) {
    try {
        // Validations
        if (!req.body.text || !req.body.author || !req.body.event) {
            respond(res, 400, 'The request is missing some data');
            next();
        }
        const author = await User.findOne({_id:req.body.author});
        const event = await Event.findOne({_id:req.body.event});
        if(!author) {
            respond(res, 404, 'Author not found');
            next();
        } 
        if(!event) {
            respond(res, 404, 'Event not found');
            next();
        }

        // Create comment
        const comment = new Comment(req.body);
        await comment.save();

        // Create comment log
        const log = new Log({
            action: author.username + ' has commented on ' + event.title + ' event',
            date: new Date(),
            link: 'event/' + req.body.eventId,
            author: author._id
        })
        log.save();

        // Respond
        respond(res, 201, {comment})
    } catch (e) {
        console.log('Error :', e);
        next(e);
    }
}

async function getComments(req, res, next) { // maybe comment date, not sure.
    try {
        if (!req.query.id) {
            respond(res, 400, 'The request is missing some data');
            next();
        }
        const event = await Event.findOne({_id:req.query.id});
        if(!event){
            respond(res, 404, 'Event not found');
            next();
        }

        // Get comments
        const comments = await Comment.find({event: req.query.id}).populate('author','username image');

        // Respond
        respond(res, 200, {comments});
        next();
    } catch (e) {
        console.log('Error :', e);
        next(e);
    }
}

module.exports = { createComment, getComments };
