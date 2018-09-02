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
    console.log(req.body);
    try {
        if(!req.body.username || !req.body.event || !req.body.stars){
            respond(res, 400, 'Bad request');
            next();
        }
        const event = await Event.findOne({_id:req.body.event});
        const user = await User.findOne({username: req.body.username});
        if(!event || !user){
            respond(res, 404, 'Not found');
            next();
        }

        // Create a vote log
        const log = new Log({
            action:req.body.username + ' has rated ' + event.title + ' with ' + req.body.stars + ' stars.',
            date: new Date(),
            link: 'event/' + req.body.event,
            author: user.image
        });
        log.save();

        // Create the vote
        const vote = new Vote({
            username: req.body.username,
            event: req.body.event
        });
        vote.save();

        // Update event vote info
        event.stars += req.body.stars;
        event.votes += 1;
        event.save();

        // Respond
        respond(res, 200, {event});
    } catch (e) {
        console.log('Error :', e);
        next(e);
    }
}

async function checkVote(req, res, next) {
    try {
        if(!req.query.username || !req.query.event){
            respond(res, 400, 'Bad request');
            next();
        }
        const event = await Event.findOne({_id:req.query.event});
        const user = await User.findOne({username: req.query.username});
        if(!event || !user){
            respond(res, 404, 'Not found');
            next();
        }
        const vote = await Vote.findOne({username: req.query.username, event: req.query.event});
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
