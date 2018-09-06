/**
 * Vote controller
 */
const mongoose = require('mongoose');

// Models
require('../models/Event');
require('../models/User');
require('../models/Vote');
require('../models/Log');
const Event = mongoose.model('events');
const User = mongoose.model('users');
const Vote = mongoose.model('votes');
const Log = mongoose.model('logs');

// JSON response utility function
const respond = function(res, status, content) {
    res.status(status);
    res.json(content);
};

async function vote(req, res, next) {
    try {
        if(!req.body.user || !req.body.event || !req.body.stars){
            respond(res, 400, 'Bad request');
            next();
        }
        const event = await Event.findOne({_id:req.body.event});
        const user = await User.findOne({_id: req.body.user});
        if(!event || !user){
            respond(res, 404, 'Not found');
            next();
        }

        // Create a vote log
        const log = new Log({
            action: user.username + ' has rated ' + event.title + ' with ' + req.body.stars + ' stars.',
            date: new Date(),
            link: 'event/' + req.body.event,
            author: user.id
        });
        log.save();

        // Create the vote
        const vote = new Vote({
            user: user._id,
            event: event._id
        });
        vote.save();

        // Update event vote info
        event.stars += req.body.stars;
        event.votes += 1;
        event.save();

        // Update user points
        user.points += req.body.stars;
        user.save();

        // Respond
        respond(res, 200, {event});
        next();
    } catch (e) {
        console.log('Error :', e);
        next(e);
    }
}

async function checkVote(req, res, next) {
    try {
        if(!req.query.user || !req.query.event){
            respond(res, 400, 'Bad request');
            next();
        }
        const event = await Event.findOne({_id:req.query.event});
        const user = await User.findOne({_id: req.query.user});
        if(!event || !user){
            respond(res, 404, 'Not found');
            next();
        }
        const vote = await Vote.findOne({user: req.query.user, event: req.query.event});
        if(!vote) {
            respond(res, 200, 'false');
        } else {
            respond(res, 200, 'true');
        }
    } catch (e) {
        console.log('Error :', e);
        next(e);
    }
}

module.exports = { vote, checkVote };
