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
    if (!req.body.title || !req.body.description || !req.body.hashtags || !req.body.private || !req.body.image || !req.body.owner) {
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
                const owner = await User.findOne({email:requestBody.owner});
                if(!owner) {
                    respond(res, 404, 'Owner not found');
                } else {
                    const event = new Event(requestBody);
                    await event.save();
                    respond(res, 201, {event})
                }
                // redirect to dashboard
            } catch (e) {
                console.log('Error :', e);
                next(e);
            }
        }
    }
}

async function getEvents(req, res, next) {
    let events;
    if (req.body.filter && req.body.type) {
        switch (req.body.filter) {
            case 'active':
                events = await Event.find({active: req.body.filter});
                break;
            case 'enrolled':
                events = await Event.find({attendees: {$elemMatch:{enroll:{ $gte: req.body.filter }}}});
                break;
            case 'top':
                events = await Event.find().sort([['points', 'descending']]);
                break;
            case 'own':
                events = await Event.find({a: 'hola'});
                break;
        }
    } else {
        events = await Event.find();
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

module.exports = { create, getEvents };
