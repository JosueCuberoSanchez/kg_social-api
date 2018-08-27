/**
 * Event controller
 */
const mongoose = require('mongoose');

require('../models/Event');
require('../models/User');
const Event = mongoose.model('events');
const User = mongoose.model('users');

// JSON response utility function
const respond = function(res, status, content) {
    res.status(status);
    res.json(content);
};

async function create(req, res, next) {
    if (!req.body.title || !req.body.description || !req.body.hashtags || !req.body.owner) {
        respond(res, 400, 'The request is missing some data');
        next();
    } else {
        const event = await Event.findOne({title: req.body.title});
        if (event) {
            respond(res, 409, 'That event already exists in the system');
            next();
        } else {
            try {
                const requestBody = req.body;
                const owner = await User.findOne({username:requestBody.owner});
                if(!owner) {
                    respond(res, 404, 'Owner not found');
                } else {
                    const event = new Event(requestBody);
                    await event.save();
                    respond(res, 201, {event})
                }
            } catch (e) {
                console.log('Error :', e);
                next(e);
            }
        }
    }
}

async function getEvents(req, res, next) {
    if(!req.query.filter || !req.query.user) {
        respond(res, 400, 'Bad request for get events');
        next();
    }
    let events;
    switch (req.query.filter) {
        case 'ALL':
            events = await Event.find();
            break;
        case 'ACTIVE':
            events = await Event.find({active: true});
            break;
        case 'ENROLLED':
            events = await Event.find({attendees: {$elemMatch:{enroll:{ $gte: req.query.user }}}});
            break;
        case 'TOP':
            events = await Event.find().sort([['points', 'descending']]);
            break;
        case 'OWNED':
            events = await Event.find({owner: req.query.user});
            break;
        case 'ID':
            events = await Event.findOne({_id: req.query.id});
            break;
    }
    if (!events) {
        respond(res, 404, 'There are no events in the db');
        next();
    } else {
        try {
            respond(res, 200, {events})
        } catch (e) {
            console.log('Error :', e);
            next(e);
        }
    }
}

async function updateEventImage(req, res, next) {
    if(!req.body.image || !req.body.id) {
        respond(res, 400, 'Bad request for image update');
        next();
    }
    const event = await Event.findOne({_id: req.body.id});
    event['image'] = req.body.image;
    if (!event) {
        respond(res, 404, 'Event not found');
        next();
    }
    const conditions = { _id: req.body.id }, update = { image: req.body.image }, options = { multi: false };
    await Event.update(conditions, update, options);
    try {
        respond(res, 200, {event})
    } catch (e) {
        console.log('Error :', e);
        next(e);
    }
}

module.exports = { create, getEvents, updateEventImage };
