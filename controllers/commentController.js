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
        if (!req.body.text || !req.body.author || !req.body.eventId) {
            respond(res, 400, 'The request is missing some data');
            next();
        }
        const author = await User.findOne({username:req.body.author});
        const event = await Event.findOne({_id:req.body.eventId});
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
            action:req.body.author + ' has commented on ' + event.title + ' event',
            date: new Date(),
            link: 'event/' + req.body.eventId,
            author: author.image
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
        const comments = await Comment.find({eventId: req.query.id});
        let author;
        let commentList = [];
        for(var i in comments) {
            author = await User.findOne({username: comments[i].author}); // get the comment's author
            commentList.push({text: comments[i].text, author: comments[i].author, authorImage: author.image,
                _id: comments[i]._id, eventId: comments[i].eventId});
        }

        // Respond
        respond(res, 200, {commentList});
        next();
    } catch (e) {
        console.log('Error :', e);
        next(e);
    }
}

module.exports = { createComment, getComments };
