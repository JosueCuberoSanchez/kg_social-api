/**
 * Event controller
 */
const mongoose = require('mongoose');

require('../models/Event');
require('../models/User');
require('../models/Comment');
const Event = mongoose.model('events');
const User = mongoose.model('users');
const Comment = mongoose.model('comments');

// JSON response utility function
const respond = function(res, status, content) {
    res.status(status);
    res.json(content);
};

async function createComment(req, res, next) {
    try {
        if (!req.body.text || !req.body.author || !req.body.eventId) {
            respond(res, 400, 'The request is missing some data');
            next();
        } else {
            const requestBody = req.body;
            const author = await User.findOne({username:requestBody.author});
            const event = await Event.findOne({_id:requestBody.eventId});
            if(!author) {
                respond(res, 404, 'Author not found');
            } else if(!event) {
                respond(res, 404, 'Event not found');
            } else {
                const comment = new Comment(requestBody);
                await comment.save();
                comment['authorImage'] = author.image;
                respond(res, 201, {comment})
            }
        }
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
        } else {
            const event = await Event.findOne({_id:req.query.id});
            if(!event)
                respond(res, 404, 'Event not found');
            const comments = await Comment.find({eventId: req.query.id});
            let author;
            let commentList = [];
            for(var i in comments) {
                author = await User.findOne({username: comments[i].author}); // get the comment's author
                commentList.push({text: comments[i].text, author: comments[i].author, authorImage: author.image,
                    _id: comments[i]._id, eventId: comments[i].eventId});
            }
            respond(res, 200, {commentList})
        }
    } catch (e) {
        console.log('Error :', e);
        next(e);
    }
}

module.exports = { createComment, getComments };
